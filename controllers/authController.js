async function root_get(req, res, next) {
  res.json({ title: 'Test Root Route' });
}

// Handles user signup
async function signup_post(req, res, next) {
  res.json({ title: 'Signup Route' });
}

// Handles login (temp)
async function login_post(req, res, next) {
  res.json({ title: 'Login Route' });
}

// Handles logout
async function logout_post(req, res, next) {
  res.json({ title: 'Logout Route' });
}

export default { signup_post, login_post, logout_post, root_get };
