require('colors')
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');

const app = express();

const PORT = process.env.PORT;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('/public'));

app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline));
