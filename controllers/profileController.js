import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Request to GET profile information
async function getSelectedProfile(req, res) {
  if (req.params.profileId === '0') {
    res.status(200).json({
      message: 'User has not created a profile',
    });
  } else {
    const selectedProfile = await prisma.profile.findUnique({
      where: {
        id: parseInt(req.params.profileId),
      },
    });
    res.status(200).json(selectedProfile);
  }
}

// Handles POST request to create a profile
async function createUserProfile(req, res) {
  const createdProfile = await prisma.profile.create({
    data: {
      userId: parseInt(req.body.userId),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      avatar: req.body.avatar,
      bio: req.body.bio,
    },
  });
  res.status(200).json({
    message: 'Profile successfully created!',
    createdProfile,
  });
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
