const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;

// mongooose mongoDB connection AGAIN
mongoose
  .connect(DB)
  .then(() => console.log('ChmuraUS Dockerized MongoDB Database Connected'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Contact Manager Backend Server is running on port ${port}`);
});
