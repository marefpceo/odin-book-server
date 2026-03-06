import { body } from 'express-validator';

const postValidationRules = [
  body('content').trim().isLength({ min: 1, max: 255 }).escape(),
];

export { postValidationRules };
