import express from 'express';
import profileController from '../controllers/profileController.js';

import { verifyValidSession } from '../helpers/protectRoutes.js';
import { validate } from '../validation/validator.js';
import { profileValidationRules } from '../validation/profileValidators.js';
import { uploadMulter } from '../helpers/multerConfig.js';

const router = express.Router();

// GET selected profile
router.get(
  '/:profileId',
  verifyValidSession,
  profileController.getSelectedProfile,
);

// POST create profile
router.post(
  '/create',
  uploadMulter.single('avatar'),
  verifyValidSession,
  profileValidationRules,
  validate,
  profileController.createUserProfile,
);

// PUT update profile
router.put(
  '/:profileId/update',
  uploadMulter.single('avatar'),
  verifyValidSession,
  profileValidationRules,
  validate,
  profileController.updateUserProfile,
);

// DELETE profile (ADMIN ROLE ONLY)
router.delete(
  '/:profileId/delete',
  verifyValidSession,
  profileController.deleteUserProfile,
);

export default router;
