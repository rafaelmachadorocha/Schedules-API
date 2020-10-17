const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');



//Importing routes and middlewares
const schedules = require('./routes/schedules');
const errorMiddleware = require('./middlewares/errors');
const ErrorHandler =  require('./utils/errorHandler');

//Setting .env variables
dotenv.config({path : './config/config.env'});

//Handling Uncaught Exceptions
process.on('uncaughtException', err => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
})


app.use(bodyParser.json());
app.use('/api/v1', schedules);

//Handling unhandled routes
app.use('*', (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404))
});

app.use(errorMiddleware);
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

//Handling unhandled promises
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection')
  server.close(() => {
    process.exit(1);
  })
})

