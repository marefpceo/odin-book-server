import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

// GET users
router.get('/', userController.usersGet);

export default router;
