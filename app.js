import 'dotenv/config';

import express from 'express';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import allowedOrigins from './helpers/corsOptions.js';

import expressSession from 'express-session';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/prisma/client.ts';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { configureLocalStrategy } from './helpers/passportAuth.js';

import authRouter from './routers/authRouter.js';
import postRouter from './routers/postRouter.js';
import profileRouter from './routers/profileRouter.js';
import userRouter from './routers/userRouter.js';

// Gzip compression
import compression from 'compression';

// Helmet
import helmet from 'helmet';
import helmetConfig from './helpers/helmetConfig.js';

// Rate Limiter
import rateLimit from 'express-rate-limit';
import opts from './helpers/rateLimitOpts.js';

// Logger setup
import logger from './helpers/logger.js';
import { pinoHttp } from 'pino-http';

//
const limiter = rateLimit(opts);

// Http logger for all routes
const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      host: req.headers.host,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

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

// Production middleware
app.use(compression());
app.use(httpLogger);
app.disable('x-powered-by');
app.use(helmet(helmetConfig));
app.use(limiter);

app.use(cors(corsOptions));
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

// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Strategies
configureLocalStrategy();

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/profile', profileRouter);

// Custom error handler
app.use((err, req, res, next) => {
  // Capture error logs
  req.log.error({
    message: err.message,
    stack: err.stack,
    status: res.statusCode,
  });
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
