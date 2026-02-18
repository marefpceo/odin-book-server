import express from 'express';
import postController from '../controllers/postController.js';
const router = express.Router();

// GET recent posts from current user and friends
router.get('/', postController.postsGet);

// GET selected post
router.get('/:postId', postController.selectedPostGet);

// GET info needed to update or create a new post
router.get('/create', postController.createPostGet);

// POST create new post
router.post('/create', postController.createPostPost);

// PUT update post
router.put('/:postId/update', postController.updatePostPut);

// DEL delete post (ADMIN role only)
router.delete('/:postId/delete', postController.deletePost);

export default router;
