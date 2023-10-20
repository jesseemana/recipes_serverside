require('colors');
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./utils/routes');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const { logger } = require('./middleware/logger');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT;

const app = express();

app.use(logger);
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50MB' }));
app.use(express.urlencoded({ limit: '50MB', extended: true }))

connectDB();

routes(app);

app.use(errorHandler);  

mongoose.connection.once('open', () => {
  console.log(`Database connected...`.cyan.underline);
  app.listen(PORT, () => console.log(`Server #${process.pid} running on port: ${PORT}...`.cyan.underline));
});

mongoose.connection.on('error', (err) => console.log(err));
 