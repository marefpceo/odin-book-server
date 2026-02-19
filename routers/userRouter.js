import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

// GET users
router.get('/', userController.usersGet);

// GET selected user
router.get('/:userId', userController.selectedUserGet);

// POST add selected user
router.post('/:userId/add', userController.addSelectedUser);

// PUT update selected user's friendship status
router.put('/:userId/update', userController.updateFriendshipStatus);

// DELETE from friend list
router.delete('/:userId/remove', userController.removeFriend);

export default router;
