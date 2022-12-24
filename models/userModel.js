const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm your password'],
        validate: {
            //this only work on SAVE!!!
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    }
})

userSchema.pre('save', async function (next) {
    //Only run when this function if password was actually modified
    if (!this.isModified('password')) return next()
    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)
    //delete passwordConfirm field
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)
module.exports = User