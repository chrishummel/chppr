//var browserify = require('browserify-middleware')
var express = require('express')
var webpack = require ('webpack');
var webpackDevMiddleware = require ('webpack-dev-middleware')  
//var webpackHotMiddleware = require ('webpack-hot-middleware')  
var config = require( './../webpack.config.js')
var compiler = webpack(config)  

var Path = require('path')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var KnexSessionStore = require('connect-session-knex')(session);
var knexPg = require('knex')({
  client: 'postgresql',
  connection: {
    database: 'yumsnap'
  }
});

var passport = require('passport')
var configPassport = require('./config/passport')(passport)
var flash    = require('connect-flash'); // messages stored in session
var fs = require('fs');
//var formidable = require('formidable');
var multer  = require('multer')
var crypto = require("crypto")
var Posts = require('./models/posts');
var Users = require('./models/users');
var Favorites = require('./models/favorites');

//for yelp api
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');
var axios = require('axios');


var storage = multer.diskStorage({
  destination: './client/pictures/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + Path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })

var app = express();

var store = new KnexSessionStore({
  knex: knexPg,
  tablename: 'sessions'
});

app.use(webpackDevMiddleware(compiler, {  
    publicPath: config.output.publicPath,  
    stats: {colors: true}  
}))

// required for passport
app.use(session({ 
  secret: 'ilovescotchscotchyscotchscotch',
  store: store,
  cookie: {
    maxAge: 30 * 60 * 1000
  }  

})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Parse incoming request bodies as JSON
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


 /* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 */


 var request_yelp = function(set_parameters, type) {
  console.log('yelp function working')
  /* The type of request */
  var httpMethod = 'GET';
  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : '2kWm_qTCzUEfSVYUjU2fIw', //process.env.oauth_consumer_key
    oauth_token : 'GpE0chVSnbgJ0edMj1DAor8mJuv3sGyL', //process.env.oauth_token
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };

  /* The url we are using for the request */
  if (type === "addCard") {
    var url = 'http://api.yelp.com/v2/search';
    var parameters = _.assign(set_parameters, required_parameters);

    //var url = "http://api.yelp.com/v2/business/p-terrys-burger-stand-austin-8"
  } else {
    var url = "http://api.yelp.com/v2/business/" + set_parameters;
    console.log('set_parameters:', set_parameters)
     /* We combine all the parameters in order of importance */ 
    var parameters = _.assign(required_parameters);

  }

  /* We set our secrets here */
  var consumerSecret = 'qaR9eRgkjIfoz3RKvubcVhUnbCk'; //process.env.consumerSecret
  var tokenSecret = 'kF-EkG1-b2mE9olO9LEdFk0ER6c'; //process.env.tokenSecret

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});
  console.log('signature:', signature)
  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);
  console.log('paramURL:', paramURL)

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;
  
  return apiURL;  
};


// ---------- Routes Start Here ------------- //

//Login route, default route
app.get('/', function(req, res) {
  console.log("Is there a req.user: ", req.user ? req.user : 'Nope')
  if (req.user) {
    res.cookie('yummy', JSON.stringify(req.user))
  }
  res.sendFile(assetFolder + '/index.html')
});


//get endpoint for json obj for posts 
app.get('/feed', function (req, res) {
	Posts.loader()
	.then(function(posts){
		res.status(201).send(posts);
	})
	.catch(function (err) {
				console.log('Error getting posts: ', err);
				return res.status(404).send(err);
	})
});

//post endpoint for user feed
app.post('/feed', function(req, res) {
  var card = req.body;
  console.log("REQ BODY City:", req.body.rest_city);

  //Compiling Yelp API's API URL based on user input
  var restCity = card.rest_city;
  var restName = card.rest_name;

  var apiURL = request_yelp(
    {
        term: restName,
        location: restCity
    }
  , 'addCard');
  console.log("API URL:", apiURL)
  //making API call to yelp using the compiled API URL
  axios({
    method: "GET",
    url: apiURL
  })
  .then(function(response) {
    console.log('response:', response.data.businesses[0].id);
    card.yelp_id = response.data.businesses[0].id;

    Posts.create(card)
    .then(function(post){
      res.status(201).send(post);
    })
    .catch(function (err) {
          console.log('Error creating new post: ', err);
          return res.status(400).send(err);
    })
    
  })
  .catch(function(err) {
    console.log("Yelp Server Error:", err)
  })
});

app.post('/upload', upload.any(), function (req, res) {
  console.log('app.post is working', req)
  console.log('reg.file', req.files[0].path)
    if (!req.files[0]) {
        return res.status(400).send('expect 1 file upload named file').end();
    }
    var filename = req.files[0].filename;
    
      res.status(201).send(filename);
});

app.get('/yelp', function(req, res) {
  var id = req.query.yelpId;
  console.log('req.query.yelpID:', id);
  //making API call to yelp using the compiled API URL
  var apiURL = request_yelp(id, 'getCard');
  console.log("API URL:", apiURL)
  axios({
    method: "GET",
    url: apiURL
  })
  .then(function(response) {
    res.json(response);  
  })
  .catch(function(err) {
    console.log("Yelp Server Error:", err)
  })

})

// endpoint thats only used to update categories table
app.post('/categories', function(req, res) {
	var cats = req.body;

	Users.categories(cats)
	.then(function(cat){
		res.status(201).send(cats);
	})
	.catch(function (err) {
				console.log('Error creating new post: ', err);
				return res.status(404).send(err);
			})
});

//app.post('/addFav', services.addFav);
app.post('/myfavs', function(req, res) {
  var fav = req.body;

  return Favorites.add(fav.userID, fav.postID)

  .then(function(resp) {
    res.status(201).send(resp);
  })
  .catch(function(err) {
    res.status(400).send(err);
  })
});

app.post('/allmyfavs', function(req, res) {
    console.log(req.body.userID)
    return Favorites.getFavByUserID(req.body.userID)
    .then(function(resp) {
      console.log('get MyFav resp: ', resp);
      return Promise.all(resp.map(function(dbObj) {
        var postID = dbObj.postID;
        return Posts.single(postID);
      }))
    })
    .then(function(resp) {
      console.log("allmyfavs: ", resp);
      var flattenResp = resp.reduce(function(a, b) { return a.concat(b) });
      res.json(flattenResp);
    })
    .catch(function(err) {
      console.log('server userFav err:', err);
      res.status(400).send(err);
    })

});

app.get('/logout', function(req,res) {
  console.log('hit it')
  req.session.destroy();
  res.redirect('/');
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('before redirect')

    res.redirect('/');
  });



app.get('/users', function (req, res) {
	Users.getUsers()
	.then(function(users){
		res.status(201).send(users);
	})
	.catch(function (err) {
				console.log('Error getting users: ', err);
				return res.status(404).send(err);
	})
})

//get endpoint for json obj for categories 
app.get('/categories', function (req, res) {
	Users.getCategories()
	.then(function(categories){
		res.status(201).send(categories);
	})
	.catch(function (err) {
				console.log('Error getting categories: ', err);
				return res.status(404).send(err);
	})
})

// Static assets (html, etc.)
var assetFolder = Path.resolve(__dirname, '../client')
app.use(express.static(assetFolder))

var port = process.env.PORT || 4000
app.listen(port)
console.log("Listening on port", port)
