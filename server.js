const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  // never implemented this, but it is valid
  // process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;

// mongooose mongoDB connection AGAIN
mongoose
  .connect(DB)
  .then(() => console.log('ChmuraUS Dockerized MongoDB Database Connected'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Contact Manager Backend Server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  // never implemented this, but it is valid
  //  server.close(() => { process.exit(1)});
});
