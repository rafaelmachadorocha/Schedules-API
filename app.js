const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const dotenv = require('dotenv');

//Setting .env variables
dotenv.config({path : './config/config.env'});

//Importing routes
const schedules = require('./routes/schedules');
const errorMiddleware = require('./middlewares/errors');

app.use(bodyParser.json());
app.use('/api/v1', schedules);
app.use(errorMiddleware);
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
})
