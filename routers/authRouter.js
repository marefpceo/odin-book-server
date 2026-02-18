import express from 'express';
import authRouter from '../controllers/authController.js';
const router = express.Router();

// POST create new user
router.post('/signup', authRouter.signup_post);

// POST login user
router.post('/login', authRouter.login_post);

// POST logout
router.post('/logout', authRouter.logout_post);

export default router;
