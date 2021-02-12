const express = require("express")
const router = express.Router()

const https = require('https')



const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const User = require('../models/User')



const _facebookAppId = process.env.FACEBOOK_APP_ID
const _facebookAppSecret = process.env.FACEBOOK_APP_SECRET 
const extendAccessTokenURL = `https://graph.facebook.com/v8.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${_facebookAppId}&client_secret=${_facebookAppSecret}&fb_exchange_token=`
const pageDetailsUrl = 'https://graph.facebook.com/v8.0/me/accounts?access_token='


const checkAuth = require("../middleware/check-auth");

// Extending Access Token and Getting Page details
async function getPageDetails(longAccessToken) {
    let dataObj;
    const getReq = await new Promise(resolve => {
        https.get(`${pageDetailsUrl}${longAccessToken}`, (res) => {
            let data = '';
            res.on('data', (d) => {
                data += d;
            })
            res.on('end', () => {
                data = JSON.parse(data)
                dataObj = data.data[0]
                resolve()
            })
        })
    })
    return dataObj;
}    


async function getLongAccessToken(shortAccessToken) {
    let longAccessToken;
    const getReq = await new Promise(resolve => {
        https.get(`${extendAccessTokenURL}${shortAccessToken}`, (res) => {
            let data = '';                  
            res.on('data', (d) => {
                data += d;
            })
            res.on('end', () => {   
                data = JSON.parse(data)
                longAccessToken =  data.access_token
                resolve()                       
            })            
           
        })
    })  
    
    return longAccessToken
}



// FB Auth Route

router.post('/auth/facebook/:id', checkAuth, async (req, res, next) => {
    const user_id = req.params.id
    const _facebookShortAccessToken = req.body.shortAccessToken;
    
    //GET long access token
   
    const _facebooklongAccessToken = await getLongAccessToken(_facebookShortAccessToken)
    const _facebookPageDetails = await getPageDetails(_facebooklongAccessToken)

    console.log(`Facebook Long Access Token: `, _facebooklongAccessToken)
    console.log(`Facebook Page details: `, _facebookPageDetails  )

    User.findById({_id: user_id}).then(user => {
        if(!user) { return res.status(401).json({ message: "User not found"}) }
        user.fb_access_token = _facebooklongAccessToken;
        user.fb_page_details = _facebookPageDetails;
        user.fb_provider = true
        user.save()
        return res.send({message: 'Facebook Account Connected Successfully'})
    })
})

module.exports = router;




