import express from 'express';
import postController from '../controllers/postController.js';
const router = express.Router();

// GET recent posts from current user and friends
router.get('/posts', postController.posts_get);

// GET selected post
router.get('/post/:postId', postController.selected_post_get);

// GET info needed to update or create a new post
router.get('/post/create', postController.create_post_get);

// POST create new post
router.post('/post/create', postController.create_post_post);

// PUT update post
router.put('/post/:postId/update', postController.update_post_put);

// DEL delete post (ADMIN role only)
router.delete('/post/:postId/delete', postController.delete_post);

export default router;
