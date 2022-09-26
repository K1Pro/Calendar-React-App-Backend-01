const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const contactRouter = require('./routes/contactRoutes');

const app = express();
app.use(cors());

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v2/contacts', contactRouter);

module.exports = app;
