const express = require('express');
const router = express.Router();
const CryptoJS = require("crypto-js");
const logger = require('express-logger')
const oauth = require('oauth');
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })

const User = require('../models/User')

const checkAuth = require('../middleware/check-auth')
const _twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const _twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const twitterCallbackUrl = process.env.TWITTER_CALLBACK_URL;
const consumer = new oauth.OAuth("https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",_twitterConsumerKey, _twitterConsumerSecret, "1.0A", twitterCallbackUrl, "HMAC-SHA1");
router.get('/auth/twitter/', (req, res) => {
  consumer.getOAuthRequestToken(function (error, oauthToken,   oauthTokenSecret, results) {
    if (error) {
      console.log(error);
    } else {
      req.session.user_id = req.params.id
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      const redirect = { 
          redirectUrl: `https://twitter.com/oauth/authorize?oauth_token=${req.session.oauthRequestToken}`
      }
      res.send(redirect);
    }
  });
});
router.get('/saveAccessTokens/:id/', checkAuth, (req, res) => {
  consumer.getOAuthAccessToken(
    req.query.oauth_token,
    req.session.oauthRequestTokenSecret,
    req.query.oauth_verifier,
      (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          logger.error(error);
          res.send(error, 500);
        }
        console.log(req.params.id)
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        console.log(`OauthAccessToken: ${oauthAccessToken}, OAuthAccessTokenSecret: ${oauthAccessTokenSecret}`)
        User.findById({ _id: req.params.id}).then(user => {
          if(!user) { return res.status(401).json({ message: "User not found"}) }
          if(user.tw_provider) { return res.send({ message: 'twitter token is set already'}) }      
          user.insert({ tw_access_token: oauthAccessToken, tw_access_token_secret: oauthAccessTokenSecret})
          user.update({ tw_provider: true })
          user.save()
          return res.send({ message: 'Twitter Account Connected Successfully' })
        })  
        
  });
    
});
module.exports = router;





























// const express = require('express')
// const router = express.Router()
// const User = require('../models/User')
// const dotenv = require('dotenv')


// dotenv.config({ path: './config/config.env' })

// var passport = require('passport')
//   , TwitterStrategy = require('passport-twitter').Strategy;

// passport.use(new TwitterStrategy({
//     consumerKey: process.env.TWITTER_CONSUMER_KEY,
//     consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//     callbackURL: process.env.TWITTER_CALLBACK_URL
//   },
//   function(token, tokenSecret, profile, done) {
//     console.log(req.params.id)
//     console.log(profile)
//     done(null, profile.id)
//   }
// ));

// // Redirect the user to Twitter for authentication.  When complete, Twitter
// // will redirect the user back to the application at
// //   /auth/twitter/callback
// router.get('/auth/twitter/:id', (req, res, next) => {
//   next()
// }, passport.authenticate('twitter'))



// // Twitter will redirect the user to this URL after approval.  Finish the
// // authentication process by attempting to obtain an access token.  If
// // access was granted, the user will be logged in.  Otherwise,
// // authentication has failed.

// router.get('/',
//   passport.authenticate('twitter', { successRedirect: '/',
//                                      failureRedirect: '/auth' } ));
