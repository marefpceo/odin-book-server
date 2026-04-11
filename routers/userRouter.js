import express from 'express';
import userController from '../controllers/userController.js';

import { verifyValidSession } from '../helpers/protectRoutes.js';
const router = express.Router();

// GET users
router.get('/', verifyValidSession, userController.usersGet);

// POST add selected user
router.post('/:userId/add', verifyValidSession, userController.addSelectedUser);

// PUT update selected user's friendship status
router.put(
  '/:userId/update',
  verifyValidSession,
  userController.updateFriendshipStatus,
);

// DELETE from friend list
router.delete(
  '/:userId/remove',
  verifyValidSession,
  userController.removeFriend,
);

export default router;
