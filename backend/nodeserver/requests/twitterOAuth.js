// const express = require("express")
// const Twitter = require('twit');
// const router = express.Router()

// const api_client = new Twitter({
//     consumer_key: 'x6nSMWg3uV58kOGm0MY22b13Y',
//     consumer_secret: 'b5YiG83NUvjHsCWlvtxmJ9H99pG9rvDJhMMC6Q51enbXQfLEhl',
//     access_token: 'ACCESS_TOKEN',
//     access_token_secret: 'ACCESS_TOKEN_SECRET'
//   });

// app.get('/home_timeline', (req, res) => {
//     const params = { tweet_mode: 'extended', count: 10 };
   
//     client
//       .get(`statuses/home_timeline`, params)
//       .then(timeline => {
         
//         res.send(timeline);
//       })
//       .catch(error => {
//       res.send(error);
//     });
      
// });