const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user_id: { type:  String },
    caption: { type: String },
    date: { type: String },
    img: { type: String },
    facebook: { type: Boolean },
    instagram: { type: Boolean },
    twitter: { type: Boolean }
})

const Post = mongoose.model('Post', postSchema, 'schedule')

module.exports = Post;