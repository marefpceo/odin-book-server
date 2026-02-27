import express from 'express';
import profileController from '../controllers/profileController.js';
import { validate } from '../validation/validator.js';
import { profileValidationRules } from '../validation/profileValidators.js';

const router = express.Router();

// GET selected profile
router.get('/:profileId', profileController.getSelectedProfile);

// POST create profile
router.post(
  '/create',
  profileValidationRules,
  validate,
  profileController.createUserProfile,
);

// PUT update profile
router.put(
  '/:profileId/update',
  profileValidationRules,
  validate,
  profileController.updateUserProfile,
);

// DELETE profile (ADMIN ROLE ONLY)
router.delete('/:profileId/delete', profileController.deleteUserProfile);

export default router;
