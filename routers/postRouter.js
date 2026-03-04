import express from 'express';
import postController from '../controllers/postController.js';
const router = express.Router();

// GET recent posts from current user and friends
router.get('/:userId', postController.postsGet);

// GET selected post
router.get('/:userId/:postId', postController.selectedPostGet);

// GET info needed to update or create a new post
router.get('/:userId/create', postController.createPostGet);

// POST create new post
router.post('/:userId/create', postController.createPostPost);

// PUT update post
router.put('/:userId/:postId/update', postController.updatePostPut);

// DEL delete post (ADMIN role only)
router.delete('/:userId/:postId/delete', postController.deletePost);

export default router;
