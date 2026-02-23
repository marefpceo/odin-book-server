// Handles user signup
async function signupPost(req, res) {
  res.json({ title: 'Signup Route' });
}

// Handles login
async function loginPost(req, res) {
  res.json({ title: 'Login Route' });
}

// Handles logout
async function logoutPost(req, res) {
  res.json({ title: 'Logout Route' });
}

export default { signupPost, loginPost, logoutPost };
