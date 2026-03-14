import express from 'express';
import postController from '../controllers/postController.js';
import commentController from '../controllers/commentController.js';

import { verifyValidSession } from '../helpers/protectRoutes.js';
import { postValidationRules } from '../validation/postValidators.js';
import { validate } from '../validation/validator.js';
const router = express.Router();

/************************************************/
/*****************Post Routes********************/

// GET recent posts from current user and friends
router.get('/:userId', verifyValidSession, postController.postsGet);

// POST create new post
router.post(
  '/:userId/create',
  verifyValidSession,
  postValidationRules,
  validate,
  postController.createPost,
);

// GET selected post
router.get(
  '/:userId/:postId',
  verifyValidSession,
  postController.selectedPostGet,
);

// Like Post
router.put(
  '/:userId/:postId/like',
  verifyValidSession,
  postController.likePost,
);

// DEL delete post (Post author or ADMIN role Only)
router.delete(
  '/:userId/:postId/delete',
  verifyValidSession,
  postController.deletePost,
);

/***************************************************/
/*****************Comment Routes********************/

// Create comment for post
router.post(
  '/:postId/comment/create',
  verifyValidSession,
  postValidationRules,
  validate,
  commentController.createComment,
);

// Get comment
router.get(
  '/:postId/comment/:commentId',
  verifyValidSession,
  commentController.getComment,
);

// Like comment
router.put(
  '/:postId/comment/:commentId/like',
  verifyValidSession,
  commentController.likeComment,
);

// Delete comment (Post Author)
router.delete(
  '/:postId/comment/:commentId/delete',
  verifyValidSession,
  commentController.deleteComment,
);

export default router;
