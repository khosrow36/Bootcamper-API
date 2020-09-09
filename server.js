const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db')

// Env files
dotenv.config({path: './config/config.env'});

// conntect to DB
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Hangle ungladled promise rejecstions
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`)
    // Close server
    server.close(() => process.exit(1));
})