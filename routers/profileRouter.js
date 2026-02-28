import express from 'express';
import profileController from '../controllers/profileController.js';
import { validate } from '../validation/validator.js';
import { profileValidationRules } from '../validation/profileValidators.js';
import { uploadMulter } from '../helpers/multerConfig.js';

const router = express.Router();

// GET selected profile
router.get('/:profileId', profileController.getSelectedProfile);

// POST create profile
router.post(
  '/create',
  uploadMulter.single('avatar'),
  profileValidationRules,
  validate,
  profileController.createUserProfile,
);

// PUT update profile
router.put(
  '/:profileId/update',
  uploadMulter.single('avatar'),
  profileValidationRules,
  validate,
  profileController.updateUserProfile,
);

// DELETE profile (ADMIN ROLE ONLY)
router.delete('/:profileId/delete', profileController.deleteUserProfile);

export default router;
