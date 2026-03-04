import express from 'express';
import postController from '../controllers/postController.js';
const router = express.Router();

// GET recent posts from current user and friends
router.get('/:userId', postController.postsGet);

// POST create new post
router.post('/:userId/create', postController.createPost);

// GET selected post
router.get('/:userId/:postId', postController.selectedPostGet);

// DEL delete post (Post author or ADMIN role Only)
router.delete('/:userId/:postId/delete', postController.deletePost);

export default router;
