require('colors');
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const config = require('config');
const helmet = require('helmet');
const cpus = require('os').cpus();
const cluster = require('cluster');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const routes = require('./utils/routes');
const connectDB = require('./utils/connectDB');
const { logger } = require('./middleware/logger');
const corsOptions = require('./utils/corsOptions');
const errorHandler = require('./middleware/errorHandler');

const PORT = config.get('port');

const app = express();

app.use(logger);
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50MB' }));
app.use(express.urlencoded({ limit: '50MB', extended: true }));

connectDB();

routes(app);

app.use(errorHandler);  

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} has started...`);
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
  mongoose.connection.on('error', (err) => console.log(err));
}
