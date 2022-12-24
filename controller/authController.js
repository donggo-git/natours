const User = require('../models/userModel')
const catchAsync = require('../ultis/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../ultis/appError')


const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    //1) check if password and email exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    //2)check if user exist && password correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect password or email', 401))
    }

    //3)if everything is ok => send the client
    const token = signToken(user._id)
    console.log(user._id)
    //console.log(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})