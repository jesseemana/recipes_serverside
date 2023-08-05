require('colors')
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const path = require('node:path')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const { logger, logEvents } = require('./middleware/logger') // Morgan can also be used for logging

const app = express()

const PORT = process.env.PORT || 8080
connectDB()

// MIDDLEWARE 
app.use(logger)
app.use(helmet())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, '/public')))

// ROUTES 
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/users', require('./routes/users'))
app.use('/api/v1/recipes', require('./routes/recipes'))
app.use('/api/v1/reviews', require('./routes/reviews'))
app.use('/api/v1/bookmarks', require('./routes/bookmarks'))
app.use('/api/v1/reset', require('./routes/resetPassword'))

// ERROR HANDLING MIDDLEWARE 
app.use(errorHandler)   

mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline)
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})  