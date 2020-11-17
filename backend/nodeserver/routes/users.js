const express = require('express') 
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const router = express.Router()
const User = require('../models/User');
const checkAuth = require('../middleware/check-auth')

//User

// router.get("/:id",
//   checkAuth,
//   (req, res, next) => {
//   User.findById({ _id: req.params.id}).then(user => {
//     if(!user) {
//         return res.status(401).json({
//           message: "User not found"
//         })
//       }
//       res.status(200).json({
//         user_id: req.params.id,
//         username: user.username,
//         fb_provider: user.fb_provider,
//         tw_provider: user.tw_provider 
//       })
//   })
// })

//Login 
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        user_id: fetchedUser._id,
        username: fetchedUser.username,
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

//Signup 
router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

//OAuth


// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
// config.env.TWITTER_CALLBACK_URL

// router.get('/auth/twitter', twitterOAuth.authenticate('twitter'), {
//   successRedirect: '/',
//   failureRedirect: '/login'
// });

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

// router.get('/auth/twitter/callback',
//   passport.authenticate('twitter', { successRedirect: '/',
//                                      failureRedirect: '/login' }));


module.exports = router