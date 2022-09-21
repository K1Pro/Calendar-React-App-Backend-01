const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;

// mongooose mongoDB connection AGAIN
mongoose.connect(DB).then(() => console.log('DB CONNECTED'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Barts server is running on port ${port}`);
});
