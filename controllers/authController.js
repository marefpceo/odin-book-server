// Handles user signup
exports.signup_post = async (req, res, next) => {
  res.json({ title: 'Signup Route' });
};

// Handles login (temp)
exports.login_post = async (req, res, next) => {
  res.json({ title: 'Login Route' });
};

// Handles logout
exports.logout_post = async (req, res, next) => {
  res.json({ title: 'Logout Route' });
};
