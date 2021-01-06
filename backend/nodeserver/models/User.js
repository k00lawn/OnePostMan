const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const UserSchema =  mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    fb_provider: { type: Boolean, default: false },
    fb_access_token: { type: String, default: false },
    fb_page_details: { type: Array, default: false},
    tw_provider: { type: Boolean, default: false },
    tw_access_token: { type: String },
    tw_access_token_secret: { type: String }
})


UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User;