require('colors');
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const { fileURLToPath } = require("url");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const { logger, logEvents } = require('./middleware/logger');
// const multer = require("multer");
const { createRecipe } = require('./controllers/recipe');
const verifyUser = require('./middleware/auth');

const app = express();

const PORT = process.env.PORT || 8080;

connectDB();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename)
// >>>>>>>>>>>>>>>>>>>>> SET SECURE TO TRUE IN AUTH CONTROLLER RES.COOKIE() IN DEPLOYMENT
//>>>>>>>>>>>>>>>>>>>>>> INSTALL MULTER 


// MIDDLEWARE 
app.use(helmet());
app.use(cors(corsOptions));
app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/assets', express.static(path.join(__dirname, '/public/assets')));


// MULTER SETUP FOR FILE UPLOAD 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

// ROUTE FOR CREATING RECIPE WITH PICTURE 
app.post('/recipes', upload.single('picture'), verifyUser, createRecipe);


// ROUTES 
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));


// ERROR 404 PAGE 
app.use('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({message: '404 Page Not Found'});
    } else {
        res.type('txt').send('404 Page Not Found');
    }
});


// ERROR HANDLING MIDDLEWARE 
app.use(errorHandler);


mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline);
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline));
});


mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});         