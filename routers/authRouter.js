const express = require('express');
const router = express.Router();

const authRouter = require('../controllers/authController');

// POST create new user
router.post('/signup', authRouter.signup_post);

// POST login user
router.post('/login', authRouter.login_post);

// POST logout
router.post('/logout', authRouter.logout_post);

module.exports = router;
