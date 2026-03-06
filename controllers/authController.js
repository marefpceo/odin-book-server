import passport from 'passport';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

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
      return res.status(401).json({
        message: info.message,
      });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        message: 'Login successful',
        user: req.session.passport.user,
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
        console.log(err);
        return next(err);
      }
      res.clearCookie('connect.sid').status(200).json({
        message: 'Logged out',
      });
    });
  });
}

export default { signupPost, loginPost, logoutPost };
