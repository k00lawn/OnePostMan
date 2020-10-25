const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user_id: { type:  String },
    caption: { type: String },
    date: { type: String },
    img: { type: String },
    facebook: { type: Boolean },
    instagram: { type: Boolean },
    twitter: { type: Boolean }
})

module.exports = mongoose.model('Post', postSchema, 'posts')