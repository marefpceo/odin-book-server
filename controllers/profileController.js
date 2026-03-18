import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs/promises';
import path from 'path';
import { getCloudinaryPublicId } from '../helpers/extractFilename.js';

import { v2 as cloudinary } from 'cloudinary';

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
  const avatarUploadResponse = await cloudinary.uploader.upload(req.file.path, {
    use_filename: true,
  });
  const createdProfile = await prisma.profile.create({
    data: {
      userId: parseInt(req.body.userId),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      avatar: avatarUploadResponse.secure_url,
      bio: req.body.bio,
    },
  });

  if (avatarUploadResponse.created_at) {
    const filename = req.file.filename;
    const filePath = path.join(__dirname, '../helpers/uploads', filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(err);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      res.status(500).json({ error: 'Could not delete file' });
    }
  }

  res.status(200).json({
    message: 'Profile successfully created!',
    createdProfile,
  });
}

// Updates the logged in user's profile
async function updateUserProfile(req, res) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: parseInt(req.params.profileId),
    },
    select: {
      avatar: true,
    },
  });

  if (profile.avatar !== null) {
    const filename = await getCloudinaryPublicId(profile.avatar);
    // delete asset from cloudinary
    await cloudinary.uploader.destroy(filename, { resource_type: 'image' });
  }

  const avatarUploadResponse = await cloudinary.uploader.upload(req.file.path, {
    use_filename: true,
  });

  // Checks if upload was successful before deleting the temp file
  if (avatarUploadResponse.created_at) {
    const filename = req.file.filename;
    const filePath = path.join(__dirname, '../helpers/uploads', filename);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(err);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      res.status(500).json({ error: 'Could not delete file' });
    }
  }

  // Update the profile with new information
  const updatedProfile = await prisma.profile.update({
    where: {
      id: parseInt(req.params.profileId),
    },
    data: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      avatar: avatarUploadResponse.secure_url,
      bio: req.body.bio,
    },
  });

  res.status(200).json({
    message: 'Profile successfully updated!',
    updatedProfile,
  });
}

// DELETE user profile (ADMIN ROLE ONLY)
async function deleteUserProfile(req, res) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: parseInt(req.params.profileId),
    },
    select: {
      avatar: true,
    },
  });

  if (profile.avatar !== null) {
    const filename = await getCloudinaryPublicId(profile.avatar);
    // delete asset from cloudinary
    await cloudinary.uploader.destroy(filename, { resource_type: 'image' });
  }

  const profileToDelete = await prisma.profile.deleteMany({
    where: {
      id: parseInt(req.params.profileId),
      AND: {
        OR: [
          {
            userId: parseInt(req.session.passport.user.id),
          },
          {
            user: {
              role: 'ADMIN',
            },
          },
        ],
      },
    },
  });

  res.status(200).json({
    message: 'Profile deleted',
    profileToDelete,
  });
}

export default {
  getSelectedProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
