import passport from 'passport';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

import logger from '../helpers/logger.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Handles user signup
async function signupPost(req, res, next) {
  const hash = await argon2.hash(req.body.password, {
    type: argon2.argon2id,
    memoryCost: 47104,
    timeCost: 1,
    parallelism: 1,
  });

  const createdUser = await prisma.user.create({
    data: {
      username: req.body.username,
      email: req.body.email,
      password: hash,
      profile: {
        create: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        },
      },
    },
    include: {
      profile: {
        include: {
          user: true,
        },
      },
    },
  });

  // Logs in the user after successful creation
  req.login(createdUser, (err) => {
    if (err) {
      return next(err);
    } else {
      logger.info(`New user ${createdUser.username} created.`);
      logger.info(`User ${createdUser.username} logged in.`);
      res.status(200).json({
        createdUser,
      });
    }
  });
}

// Handles user login
async function loginPost(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      logger.error('User authentication error');
      return res.status(401).json({
        message: info.message,
      });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      logger.info(`User ${req.session.passport.user.username} logged in.`);
      res.status(200).json({
        message: 'Login successful',
        user: req.session.passport.user,
        isAuthenticated: true,
      });
    });
  })(req, res, next);
}

// Handles logout
async function logoutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        logger.log(err);
        return next(err);
      }
      res.clearCookie('connect.sid').status(200).json({
        message: 'Logged out',
      });
    });
  });
}

// Validates the session
async function validateSession(req, res) {
  if (req.session.id) {
    try {
      const session = await prisma.session.findUnique({
        where: {
          sid: `${req.session.id}`,
        },
      });

      if (session === null) {
        res.json({
          isAuthenticated: false,
        });
      } else {
        res.json({
          isAuthenticated: true,
          user:
            req.session.passport === undefined ? '' : req.session.passport.user,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default { signupPost, loginPost, logoutPost, validateSession };
