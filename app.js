const express = require('express');
const app = express();

const dotenv = require('dotenv');

//Setting .env variables
dotenv.config({path : './config/config.env'});

//Importing routes
const schedules = require('./routes/schedules');


app.use(schedules);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
})