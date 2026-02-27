import express from 'express';
import authController from '../controllers/authController.js';
import { authValidationRules } from '../validation/authValidators.js';
import { validate } from '../validation/validator.js';

const router = express.Router();

// POST create new user
router.post(
  '/signup',
  authValidationRules,
  validate,
  authController.signupPost,
);

// POST login user
router.post('/login', authValidationRules, validate, authController.loginPost);

// POST logout
router.post('/logout', authController.logoutPost);

export default router;
