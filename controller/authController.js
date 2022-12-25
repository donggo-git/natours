const { promisify } = require('util')
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

exports.protect = catchAsync(async (req, res, next) => {
    //1) Getting the token and check if it's exist
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) return next(new AppError('You are not login! Please login to get access', 401))
    //2) Verification the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
    //3) Check if user still exists
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) return next(new AppError('The user belonging this token does no longer exist', 401))
    //4) Check if user changed password after the token was issued
    if (freshUser.changesPasswordAfter(decoded.iat)) {
        return next(new AppError('User rencently changed password! Please login again.', 404))
    }

    //Grant access to protected route
    req.user = freshUser
    next()
})