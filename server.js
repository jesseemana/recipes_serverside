const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logger') // Morgan can also be used for logging
const path = require('node:path')
const cpus = require('node:os').cpus()
const cluster = require('node:cluster')
require('colors')
require('dotenv').config()
require('express-async-errors')

const app = express();

const PORT = process.env.PORT || 8080;

connectDB();

// MIDDLEWARE 
app.use(logger);
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '/public')));

// ROUTES 
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/recipes', require('./routes/recipes'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/bookmarks', require('./routes/bookmarks'));
app.use('/api/v1/reset', require('./routes/resetPassword'));

// ERROR HANDLING MIDDLEWARE 
app.use(errorHandler);

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} has started..`);
  for (let i = 0; i < cpus.length; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died...`);
    cluster.fork();
  })
} else {
  console.log(`Worker ${process.pid} started...`)
  mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline);
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline));
  });

  mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
  });
} 