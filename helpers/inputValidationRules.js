// Express-Validator rules can be reused in any project that uses Express-Validator.
// Prisma ORM import can be added/ removed as necessary

import { body, validationResult } from 'express-validator';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Reuseable validation rules
const validationRules = [
  body('username')
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage('Username must be at least 8 characters')
    .escape()
    .custom(async (value) => {
      const usernameCheck = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (usernameCheck) {
        throw new Error('Username already in use');
      }
    }),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email format invalid. (ex. user@email.com')
    .escape()
    .custom(async (value) => {
      const emailCheck = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (emailCheck) {
        throw new Error('Email already in use');
      }
    })
    .withMessage('Email already in use'),
  body('password')
    .trim()
    .isLength({ min: 9 })
    .withMessage('Password must contain a minimum of 9 characters')
    .escape(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Middleware to handle results
const validate = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

export default { validationRules, validate };
