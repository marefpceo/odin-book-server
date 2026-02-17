require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const allowedOrigins = require('./helpers/corsOptions');
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  maxAge: 300,
  optionsSuccessStatus: 204,
};

const indexRouter = require('./routers/indexRouter');

const app = express();

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Allows for the use of dotfiles from the static folder(s)
app.use(
  '/.well-known',
  express.static('helpers/.well-known', { dotfiles: 'allow' }),
);
app.use(express.static(path.join(__dirname, 'helpers')));

app.use('/', indexRouter);

// Custom error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  // Logs the error to console
  console.error(err);

  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Middleware to handle 404 errors
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  // Logs the error to console
  console.error();
  res.status(404).json({
    message: 'Resource not found',
  });
});

module.exports = app;
