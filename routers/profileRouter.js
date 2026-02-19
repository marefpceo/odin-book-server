import express from 'express';
import profileController from '../controllers/profileController.js';

const router = express.Router();

// GET current user profile
router.get('/', profileController.getUserProfile);

// GET selected profile
router.get('/:profileId', profileController.getSelectedProfile);

// POST create profile
router.post('/create', profileController.createUserProfile);

// PUT update profile
router.put('/:profileId/update', profileController.updateUserProfile);

// DELETE profile (ADMIN ROLE ONLY)
router.delete('/:profileId/delete', profileController.deleteUserProfile);

export default router;
