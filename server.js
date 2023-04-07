require('colors')
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const path = require('node:path')
const { fileURLToPath } = require("url")
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const multer = require("multer")
const { createRecipe } = require('./controllers/recipe')
const { logger, logEvents } = require('./middleware/logger') // Morgan can also be used for logging
const verifyUser = require('./middleware/auth')
const cluster = require('node:cluster')
const os = require('node:os')

const app = express()

const PORT = process.env.PORT || 8080

connectDB()


// MIDDLEWARE 
app.use(logger)
app.use(helmet())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/assets', express.static(path.join(__dirname, '/uploaads')))


// MULTER SETUP FOR FILE UPLOAD 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

app.post('/recipes', verifyUser, upload.single('picture'), createRecipe)


// ROUTES 
app.use('/auth', require('./routes/auth'))
app.use('/users', require('./routes/users'))
app.use('/recipes', require('./routes/recipes'))


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