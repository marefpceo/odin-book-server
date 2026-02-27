import { validationResult } from 'express-validator';

// Middleware to handle results
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  next();
};
