import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

import { validate } from '../helpers/inputValidationRules.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Request to GET profile information for selected User
async function getSelectedProfile(req, res) {
  if (req.params.profileId === null) {
    res.status(200).json({
      message: 'User has not created a profile',
    });
  } else {
    res.json({ title: req.params.profileId });
  }
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
  getSelectedProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
