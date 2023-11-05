require('dotenv').config();
require('express-async-errors');
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';
const cpus = require('os').cpus();
import cluster from 'cluster';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import log from './utils/logger';
import routes from './utils/routes';
import connectDB from './utils/connectDB';
import corsOptions from './utils/corsOptions';
import errorHandler from './middleware/errorHandler'; 

const PORT = config.get('port');

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50MB' }));
app.use(express.urlencoded({ limit: '50MB', extended: true }));

connectDB();

routes(app);

app.use(errorHandler);  

if (cluster.isPrimary) {
  log.info(`Master process ${process.pid} has started...`);
  for (let i = 0; i < cpus.length; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    log.info(`Worker ${worker.process.pid} has died...`);
    cluster.fork();
  });
} else {
  mongoose.connection.once('open', () => {
    log.info(`Database connected...`);
    app.listen(PORT, () => log.info(`Server #${process.pid} running on port: ${PORT}...`));
  });
  mongoose.connection.on('error', (err) => console.log(err));
}
