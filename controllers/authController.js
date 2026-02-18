async function rootGet(req, res, next) {
  res.json({ title: 'Test Root Route' });
}

// Handles user signup
async function signupPost(req, res, next) {
  res.json({ title: 'Signup Route' });
}

// Handles login (temp)
async function loginPost(req, res, next) {
  res.json({ title: 'Login Route' });
}

// Handles logout
async function logoutPost(req, res, next) {
  res.json({ title: 'Logout Route' });
}

export default { signupPost, loginPost, logoutPost, rootGet };
