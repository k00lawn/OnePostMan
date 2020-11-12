const mongoose = require('mongoose')

const postSchema =  mongoose.Schema({
    userId: { type:  String },
    caption: { type: String },
    date: { type: String },
    img: { type: String },
    facebook: { type: Boolean },
    twitter: { type: Boolean }
})

const Post = mongoose.model('Post', postSchema, 'schedule')

module.exports = Post;