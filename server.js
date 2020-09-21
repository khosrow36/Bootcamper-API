const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')

// Env files
dotenv.config({path: './config/config.env'});

// conntect to DB
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Hangle ungladled promise rejecstions
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`.red)
    // Close server
    server.close(() => process.exit(1));
})