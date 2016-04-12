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

var Posts = require('./../client/models/posts');
var Users = require('./../client/models/users');

var routes = express.Router()
var app = express()


app.use(webpackDevMiddleware(compiler, {  
    publicPath: config.output.publicPath,  
    stats: {colors: true}  
}))

//app.use(webpackHotMiddleware(compiler, {  
//    log: console.log 
//})) 
// Parse incoming request bodies as JSON
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


// Mount our main router
app.use('/', routes)




// ---------- Routes Start Here ------------- //


//Login route, default route
routes.get('/', function(req, res) {
	res.sendFile(assetFolder + '/login.html')
})


//get endpoint for json obj for posts 
routes.get('/feed', function (req, res) {
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
routes.get('/dashboard', function (req, res) {
	res.sendFile(assetFolder + '/index.html')
})

routes.get('/pictures/')

//post endpoint for user feed
routes.post('/feed', function(req, res) {
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
routes.post('/categories', function(req, res) {
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


//Signup And login routes will be changed/deleted once auth is set up
routes.post('/signup', function(req, res) {
	var user = req.body;
	
	Users.create(user)
	.then(function(person){
		res.status(201).send(person);
	})
	.catch(function (err) {
	console.log('Error creating new user: ', err);
	return res.status(404).send(err);
	})
})


routes.post('/login', function (req, res) {
	var user = req.body.username;
	var pass = req.body.password;

	Users.verify(user, pass).then(function (person) {
		if (person){
			res.status(201).send(person);
		}
		else {
			res.status(400);
			res.end('not a user')
		}
	})
})

/////// NOTE TO FUTURE GROUPS //////
/////// THIS ALMOST KINDA WORKS ////
routes.post('/upload', function (req, res) {
	var file = req.body;
  console.log("req body:", file);
  var path = "./client/pictures/test4.jpg"
  fs.writeFile(path, file.preview, function(err) {
    if (err) {throw err};
    console.log('No errors!');
  })
})


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// route for passport
require('./models/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Static assets (html, etc.)
var assetFolder = Path.resolve(__dirname, '../client')
routes.use(express.static(assetFolder))

var port = process.env.PORT || 4000
app.listen(port)
console.log("Listening on port", port)
