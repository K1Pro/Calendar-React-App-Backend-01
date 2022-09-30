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
  req.requestTime = new Date().toISOString();
  console.log(`Query Date: ${req.requestTime}`);
  next();
});

// Routes
app.use('/api/v2/contacts', contactRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
