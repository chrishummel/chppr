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

// ---------- Routes Start Here ------------- //

//Login route, default route
app.get('/', function(req, res) {
  console.log("Is there a req.user: ", req.user ? req.user : 'Nope')
  if (req.user) {
    res.cookie('yummy', JSON.stringify(req.user))
  }
  res.sendFile(assetFolder + '/index.html')
})


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
})

app.get('/logout', function(req,res) {
	console.log('hit it')
  req.session.destroy();
  res.redirect('/');
})

//post endpoint for user feed
app.post('/feed', function(req, res) {
	var card = req.body;
	console.log("REQ BODY:", req);
  if (card === {}) {
    return res.status(400).send("failed");
  }
	Posts.create(card)
	.then(function(post){
		res.status(201).send(post);
	})
	.catch(function (err) {
				console.log('Error creating new post: ', err);
				return res.status(400).send(err);
			})
})

app.post('/upload', upload.any(), function (req, res) {
  console.log('app.post is working', req)
  console.log('reg.file', req.files[0].path)
    if (!req.files[0]) {
        return res.status(400).send('expect 1 file upload named file').end();
    }
    var filename = req.files[0].filename;
    
      res.status(201).send(filename);
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
