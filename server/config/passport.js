var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

// ****************
// load up the user model (user schema)
var User = require('../models/users.js');

// load up the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {
// required for persistent login sessions : passport needs to serialize and unserialize users out of session
  
  passport.serializeUser(function(user, done) {
    console.log('serialize user:', user)
    done(null, user.facebook_id);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

// FACEBOOK
passport.use(new FacebookStrategy({
      
      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL

    },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

     // process.nextTick(function() {
          User.findByFacebookID(profile.id)
            .then(function(user) {
              if (user) {
                return done(null, user); 
              } else {
                var newUser = {}
                newUser.facebook_id    = profile.id;                    
                newUser.facebook_token = token;                    
                newUser.username       = profile.displayName;

                User.create(newUser)
                  .then(function(){
                    console.log('create user:', newUser)
                    delete newUser.facebook_token;
                    return done(null, newUser);
                  });
              } 

            });
        //});

    }));
// fb token close FN
}
// TWITTER
/*
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

    });

   })); 
    // close twitter strategy

}; // close entire exports FN? sublime highlights this as extra.

*/

