import express from 'express';
import postRouter from '../controllers/postController.js';
const router = express.Router();

// GET recent posts from current user and friends
router.get('/posts', postRouter.posts_get);

// GET selected post
router.get('/post/:postId', postRouter.selected_post_get);

// GET info needed to update or create a new post
router.get('/post/create', postRouter.create_post_get);

// POST create new post
router.post('/post/create', postRouter.create_post_post);

// PUT update post
router.put('/post/:postId/update', postRouter.update_post_put);

// DEL delete post (ADMIN role only)
router.delete('/post/:postId/delete', postRouter.delete_post);

export default router;
