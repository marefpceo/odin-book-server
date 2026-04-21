import { body } from 'express-validator';

// Reuseable validation rules
const profileValidationRules = [
  // body('firstname')
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage('First name is required')
  //   .escape(),

  // body('lastname')
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage('Last name is required')
  //   .escape(),

  body('bio').trim().isLength({ min: 1, max: 120 }).escape(),
];

export { profileValidationRules };
