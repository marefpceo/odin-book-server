import { body } from 'express-validator';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const signupValidationRules = [
  body('firstname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required')
    .escape(),

  body('lastname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required')
    .escape(),

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

const loginValidationRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email format invalid. (ex. user@email.com')
    .escape(),

  body('password')
    .trim()
    .isLength({ min: 9 })
    .withMessage('Password must contain a minimum of 9 characters')
    .escape(),
];

export { signupValidationRules, loginValidationRules };
