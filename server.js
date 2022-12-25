const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...')
    console.log(err.name, err.message)
})

dotenv.config({ path: './config.env' })
const app = require('./app')


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB connection is successful')
}).catch(err => {
    console.log('ERR')
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

//TEST
process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLER REJECTION')
    server.close(() => {
        process.exit(1)
    })

})

