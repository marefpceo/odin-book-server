import express from 'express';
import authController from '../controllers/authController.js';
import {
  signupValidationRules,
  loginValidationRules,
} from '../validation/authValidators.js';
import { validate } from '../validation/validator.js';

const router = express.Router();

// POST create new user
router.post(
  '/signup',
  signupValidationRules,
  validate,
  authController.signupPost,
);

// POST login user
router.post('/login', loginValidationRules, validate, authController.loginPost);

// POST logout
router.post('/logout', authController.logoutPost);

// GET session status for front end
router.get('/validate-session', authController.validateSession);

export default router;
