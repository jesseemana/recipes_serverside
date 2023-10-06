require('colors');
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cpus = require('node:os').cpus();
const cluster = require('node:cluster');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const cloudinary = require('./utils/cloudinary');
const verifyToken = require('./middleware/auth');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const { logger, logEvents } = require('./middleware/logger');

const app = express();

const PORT = process.env.PORT || 8080;

connectDB();

// MIDDLEWARE 
app.use(logger);
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50MB' }));
app.use(express.urlencoded({ limit: '50MB', extended: true }));

routes(app);

// ROUTES 
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/recipes', require('./routes/recipes'));
// app.use('/api/v1/reviews', require('./routes/reviews'));
// app.use('/api/v1/bookmarks', require('./routes/bookmarks'));
// app.use('/api/v1/reset', require('./routes/resetPassword'));

// app.post('/api/v1/upload', verifyToken, async(req, res) => {
//   const response = await cloudinary.uploader.upload(req.body.data, {
//     upload_preset: 'recipes' // CONFIGURE UPLOAD_PRESET IN CLOUDINARY
//   }); 
//   res.status(200).json({
//     id: response.public_id,
//     url: response.secure_url,
//   });
// });

// ERROR HANDLING MIDDLEWARE 
app.use(errorHandler);

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} has started..`);
  for (let i = 0; i < cpus.length; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} has died...`);
    cluster.fork();
  });
} else {
  mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline);
    app.listen(PORT, () => console.log(`Server #${process.pid} running on port: ${PORT}...`.cyan.underline));
  });

  mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
  });
}   