const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'User must have a name']
    },
    email: {
        type: String,
        require: [true, 'User must have a email'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail]
    },
    photo: String,
    password: {
        type: String,
        require: [true, 'User must have a password'],
        minLength: 8
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm your password']
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User