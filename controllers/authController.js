import passport from 'passport';
import { body, validationResult } from 'express-validator';

// Handles user signup
async function signupPost(req, res) {
  res.json({ title: 'Signup Route' });
}

// Handles user login
async function loginPost(req, res, next) {
  (body('email').trim().isEmail().escape(),
    body('password').trim().isLength({ min: 9 }).escape(),
    (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(401).json({
          message: 'Email or password incorrect',
          email: req.body.email,
          password: req.body.password,
        });
      }
    },
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          message: info.message,
        });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          message: 'Login successful',
          user: req.user,
        });
      });
    })(req, res, next));
}

// Handles logout
async function logoutPost(req, res) {
  res.json({ title: 'Logout Route' });
}

export default { signupPost, loginPost, logoutPost };
