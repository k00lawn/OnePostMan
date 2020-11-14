const express = require('express')
const router = express.Router()
const User = require('../models/User')
const dotenv = require('dotenv')


dotenv.config({ path: './config/config.env' })

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    console.log(req.params.id)
    console.log(token)
    console.log(done())
    done(null, user)
    // User.findById({_id: req.params.id}).then(user => {
    //     if(!user) { return console.error();}
        
        
    // }) 
    //done(null, console.log(token,tokenSecret, profile))
  }
));

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
router.get('/auth/twitter/:id', passport.authenticate('twitter'), (req, res, next) => {
  console.log(req.params.id)
});

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

// router.get('/auth/twitter/callback',
//   passport.authenticate('twitter', { successRedirect: '/',
//                                      failureRedirect: '/login' }));

module.exports = router