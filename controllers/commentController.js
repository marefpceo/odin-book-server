import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Create a new comment and return the record
async function createComment(req, res) {
  const comment = await prisma.comment.create({
    data: {
      postId: parseInt(req.params.postId),
      userId: parseInt(req.body.userId),
      content: req.body.content,
    },
  });
  res.status(200).json({
    comment,
  });
}

// Get selected comment by comment id
async function getComment(req, res) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(req.params.commentId),
    },
    include: {
      user: true,
    },
  });

  res.status(200).json({
    comment,
  });
}

// Update record likes count for anyone other than the post author
async function likeComment(req, res) {
  const commentLikes = await prisma.comment.update({
    where: {
      id: parseInt(req.params.commentId),
      NOT: [
        {
          userId: parseInt(req.body.userId),
        },
      ],
    },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  res.status(200).json({
    commentLikes,
  });
}

// Delete the selected comment. Can be done by comment author and post author
async function deleteComment(req, res) {
  const commentToDelete = await prisma.comment.delete({
    where: {
      id: parseInt(req.params.commentId),
    },
  });

  res.status(200).json({
    commentToDelete,
    message: 'Comment deleted',
  });
}

export default { createComment, getComment, likeComment, deleteComment };
