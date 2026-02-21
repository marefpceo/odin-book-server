import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import allowedOrigins from './helpers/corsOptions.js';

import expressSession from 'express-session';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client/extension';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import authRouter from './routers/authRouter.js';
import postRouter from './routers/postRouter.js';
import profileRouter from './routers/profileRouter.js';
import userRouter from './routers/userRouter.js';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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

// Uses Prisma to store sessions
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

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
