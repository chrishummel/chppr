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
var bodyParser = require('body-parser')

var passport = require('passport')
var flash    = require('connect-flash'); // messages stored in session
var fs = require('fs');
var formidable = require('formidable');
var multer  = require('multer')
//var upload = multer({ dest: './client/pictures/' })
var Posts = require('./models/posts');
var Users = require('./models/users');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '../client/pictures');   
  },
  filename: function(req, file, cb) {
    console.log('filename file.name:', file.name)
    cb(null, file.name);
  } 
})

var upload = multer({storage: storage});

var app = express()


app.use(webpackDevMiddleware(compiler, {  
    publicPath: config.output.publicPath,  
    stats: {colors: true}  
}))

// Parse incoming request bodies as JSON
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- Routes Start Here ------------- //

//Login route, default route
app.get('/', function(req, res) {
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

//get endpoint to serve up index.html
// app.get('/dashboard', function (req, res) {
// 	res.sendFile(assetFolder + '/index.html')
// })

// app.get('/pictures/')

//post endpoint for user feed
app.post('/feed', function(req, res) {
	var card = req.body;
	console.log("REQ BODY:", req.body);
	Posts.create(card)
	.then(function(post){
		res.status(201).send(post);
	})
	.catch(function (err) {
				console.log('Error creating new post: ', err);
				return res.status(404).send(err);
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
})


app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//Signup And login routes will be changed/deleted once auth is set up
// app.post('/signup', function(req, res) {
// 	var user = req.body;
	
// 	Users.create(user)
// 	.then(function(person){
// 		res.status(201).send(person);
// 	})
// 	.catch(function (err) {
// 	console.log('Error creating new user: ', err);
// 	return res.status(404).send(err);
// 	})
// })


// app.get('/login', function (req, res) {
// 	var user = req.body.username;
// 	var pass = req.body.password;

// 	Users.verify(user, pass).then(function (person) {
// 		if (person){
// 			res.status(201).send(person);
// 		}
// 		else {
// 			res.status(400);
// 			res.end('not a user')
// 		}
// 	})
// })

/////// NOTE TO FUTURE GROUPS //////
/////// THIS ALMOST KINDA WORKS ////

// app.post('/upload', function (req, res) {
// 	var file = req.body;
//   console.log("req body:", req.files);

//   var path = "./client/pictures/" + file.name;
//   fs.writeFile(path, file, function(err) {
//     if (err) {throw err;};
//     console.log('No errors!');
//     res.status(201).send(file);
//   })  
// })


// app.post('/upload', function(req, res) {
//     var incomingForm = req.form  // it is Formidable form object
//     console.log('server upload: ', req.form);

//     // Main entry for parsing the files
//     // needed to start Formidables activity
//     incomingForm.parse(req, function(err, fields, files){
//       console.log('server upload fields & files: ', fields, files);

//     })
// })

//

app.post('/upload', upload.any(), function (req, res) {
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    
      res.send(req.file);
  })
  
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
 

// app.post('/upload', function(req, res){
//     // parse a file upload 
//     var form = new formidable.IncomingForm();

//     console.log('server form: ', form);
 
//     // form.parse(req, function(err, fields, files) {
//     //   res.writeHead(200, {'content-type': 'text/plain'});
//     //   res.write('received upload:\n\n');
//     //   res.end(util.inspect({fields: fields, files: files}));
//     // });
//  });


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// route for passport
//require('./models/app.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Static assets (html, etc.)
var assetFolder = Path.resolve(__dirname, '../client')
app.use(express.static(assetFolder))

var port = process.env.PORT || 4000
app.listen(port)
console.log("Listening on port", port)
