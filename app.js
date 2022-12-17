const express = require('express');
const fs = require('fs')
const morgan = require('morgan')
const tourRouters = require('./routes/tourRoutes')
const globalErrorHandler = require('./controller/errorController')
const userRouters = require('./routes/userRoutes')
const appError = require('./ultis/appError')

const app = express();


// 1) MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})


app.use('/api/v1/tours', tourRouters)
app.use('/api/v1/users', userRouters)

app.all('*', function (req, res, next) {
    /*res.status(404).json({
        status: fail,
        message: `Can find the ${req.originalUrl} on this server`
    })*/
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app