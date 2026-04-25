import express from 'express';
import profileController from '../controllers/profileController.js';

import { verifyValidSession } from '../helpers/protectRoutes.js';
import { validate } from '../validation/validator.js';
import { profileValidationRules } from '../validation/profileValidators.js';
import { uploadMulter } from '../helpers/multerConfig.js';
import multer from 'multer';

const router = express.Router();

const upload = uploadMulter.single('avatar');

// GET selected profile
router.get(
  '/:profileId',
  verifyValidSession,
  profileController.getSelectedProfile,
);

// POST create profile
router.post(
  '/create',
  function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.json({
          message: err.message,
        });
      } else if (err) {
        res.json({
          message: err.message,
        });
      }
    });
  },
  verifyValidSession,
  profileValidationRules,
  validate,
  profileController.createUserProfile,
);

// PUT update profile
router.put(
  '/:profileId/update',
  function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.json({
          message: err.message,
        });
      } else if (err) {
        res.json({
          message: err.message,
        });
      }
    });
  },
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
