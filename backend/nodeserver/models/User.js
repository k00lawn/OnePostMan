const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema, 'users')

module.exports = User;