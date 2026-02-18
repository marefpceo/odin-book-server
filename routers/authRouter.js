import express from 'express';
import authController from '../controllers/authController.js';
const router = express.Router();

// Test route
router.get('/', authController.root_get);

// POST create new user
router.post('/signup', authController.signup_post);

// POST login user
router.post('/login', authController.login_post);

// POST logout
router.post('/logout', authController.logout_post);

export default router;
