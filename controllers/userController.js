// Handles getting a list of all users
async function usersGet(req, res) {
  res.json({ title: 'GET /users' });
}

// Handles getting record for the selected user by userId
async function selectedUserGet(req, res) {
  res.json({ title: 'GET /users/:userId' });
}

// POST request to add selected user as a friend
async function addSelectedUser(req, res) {
  res.json({ title: 'POST /users/:userId/add' });
}

// PUT request to update friendship status
async function updateFriendshipStatus(req, res) {
  res.json({ title: 'PUT /users/:userId/update' });
}

// Handles DELETE request to remove selected user from friend's list
async function removeFriend(req, res) {
  res.json({ title: 'DELETE /users/:userId/remove' });
}

export default {
  usersGet,
  selectedUserGet,
  addSelectedUser,
  updateFriendshipStatus,
  removeFriend,
};
