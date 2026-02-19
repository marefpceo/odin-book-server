import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import allowedOrigins from './helpers/corsOptions.js';

import authRouter from './routers/authRouter.js';
import postRouter from './routers/postRouter.js';
import profileRouter from './routers/profileRouter.js';
import userRouter from './routers/userRouter.js';

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  maxAge: 300,
  optionsSuccessStatus: 204,
};

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
app.use(express.static('helpers'));

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/profile', profileRouter);

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

export default app;
