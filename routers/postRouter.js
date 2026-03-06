import express from 'express';
import postController from '../controllers/postController.js';
import commentController from '../controllers/commentController.js';

import { postValidationRules } from '../validation/postValidators.js';
import { validate } from '../validation/validator.js';
const router = express.Router();

/************************************************/
/*****************Post Routes********************/

// GET recent posts from current user and friends
router.get('/:userId', postController.postsGet);

// POST create new post
router.post(
  '/:userId/create',
  postValidationRules,
  validate,
  postController.createPost,
);

// GET selected post
router.get('/:userId/:postId', postController.selectedPostGet);

// DEL delete post (Post author or ADMIN role Only)
router.delete('/:userId/:postId/delete', postController.deletePost);

/***************************************************/
/*****************Comment Routes********************/

// Create comment for post
router.post(
  '/:postId/comment/create',
  postValidationRules,
  validate,
  commentController.createComment,
);

// Get comment
router.get('/:postId/comment/:commentId', commentController.getComment);

// Like comment
router.put('/:postId/comment/:commentId/like', commentController.likeComment);

// Delete comment (Post Author)
router.delete(
  '/:postId/comment/:commentId/delete',
  commentController.deleteComment,
);

export default router;
