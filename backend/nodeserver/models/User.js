const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const UserSchema =  mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
})


UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User;