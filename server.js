require('colors');
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const {logger, logEvents} = require('./middleware/logger');

const app = express();

const PORT = process.env.PORT;

connectDB();

// MIDDLEWARE 
app.use(helmet());
app.use(cors(corsOptions));
app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', express.static(path.join(__dirname, '/public')));


// ROUTES 
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));
app.use('/recipes/:id', require('./routes/recipes'));


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


// ERROR HANDLER MIDDLEWARE 
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline);
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline));
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
