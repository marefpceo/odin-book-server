const express = require('express');
const router = express.Router();

const indexRouter = require('../controllers/indexController');

// POST create new user
router.post('/signup', indexRouter.signup_post);

// POST login user
router.post('/login', indexRouter.login_post);

// POST logout
router.post('/logout', indexRouter.logout_post);

module.exports = router;
