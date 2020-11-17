const express = require('express') 
const router = express.Router()
const User = require('../models/User');
const checkAuth = require('../middleware/check-auth')

router.get("/:id", checkAuth, (req, res, next) => {
    User.findById({ _id: req.params.id}).then(user => {
        if(!user) {
            return res.status(401).json({
            message: "User not found"
            })
        }
        res.status(200).json({
          user_id: req.params.id,
          username: user.username,
          fb_provider: user.fb_provider,
          tw_provider: user.tw_provider 
        })
    })
})

router.delete("/fbrevoke/:id", checkAuth, (req, res, next) => {
    User.findById({ _id: req.params.id}).then(user => {
        if(!user) {
            return res.status(401).json({
            message: "User not found"
            })
        }
        user.fb_provider = false;
        user.fb_access_token = undefined;
        user.save()
        return res.status(200).json({
            fb_provider: user.fb_provider 
         })
    })
})

router.delete("/twrevoke/:id", checkAuth, (req, res, next) => {
    User.findById({ _id: req.params.id}).then(user => {
        if(!user) {
            return res.status(401).json({
            message: "User not found"
            })
        }
        user.tw_provider = false;
        user.tw_access_token = undefined;
        user.tw_access_token_secret = undefined;
        user.save()
        return res.status(200).json({
           tw_provider: user.tw_provider 
        })
    })
})

module.exports = router