import { body } from 'express-validator';

// Reuseable validation rules
const profileValidationRules = [
  body('bio').optional().trim().isLength({ min: 1, max: 120 }).escape(),
];

export { profileValidationRules };
