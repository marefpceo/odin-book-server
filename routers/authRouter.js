import express from 'express';
import authController from '../controllers/authController.js';
const router = express.Router();

// POST create new user
router.post('/signup', authController.signupPost);

// POST login user
router.post('/login', authController.loginPost);

// POST logout
router.post('/logout', authController.logoutPost);

export default router;
