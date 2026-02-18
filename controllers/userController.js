// Handles getting a list of all users
async function usersGet(req, res, next) {
  res.json({ title: 'GET /users' });
}

export default { usersGet };
