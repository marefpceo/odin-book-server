// GET request to retrieve the profile information for the current user
async function getUserProfile(req, res) {
  res.json({ title: 'GET /profile' });
}

// Request to GET profile information for selected User
async function getSelectedProfile(req, res) {
  res.json({ title: 'GET /profile/:profileId' });
}

// Handles POST request to create a profile
async function createUserProfile(req, res) {
  res.json({ title: 'POST /profile/create' });
}

// Updates the user profile
async function updateUserProfile(req, res) {
  res.json({ title: 'PUT /profile/:profileId/update' });
}

// DELETE user profile (ADMIN ROLE ONLY)
async function deleteUserProfile(req, res) {
  res.json({ title: 'DELETE /profile/:profileId/delete' });
}

export default {
  getUserProfile,
  getSelectedProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
