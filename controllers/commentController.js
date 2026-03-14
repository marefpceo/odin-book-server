import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Create a new comment and return the record
async function createComment(req, res) {
  const newComment = await prisma.comment.create({
    data: {
      postId: parseInt(req.params.postId),
      userId: parseInt(req.body.userId),
      content: req.body.content,
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const comment = {
    id: newComment.id,
    postId: newComment.postId,
    userId: newComment.userId,
    createdAt: newComment.createdAt,
    content: newComment.content,
    likes: newComment._count.likes,
  };
  res.status(200).json({
    comment,
  });
}

// Get selected comment by comment id
async function getComment(req, res) {
  const selectedComment = await prisma.comment.findUnique({
    where: {
      id: parseInt(req.params.commentId),
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!selectedComment) {
    res.status(200).json({
      message: 'Comment not found',
    });
  } else {
    const comment = {
      id: selectedComment.id,
      postId: selectedComment.postId,
      userId: selectedComment.userId,
      createdAt: selectedComment.createdAt,
      content: selectedComment.content,
      likes: selectedComment._count.likes,
    };

    res.status(200).json({
      comment,
    });
  }
}

// Update record likes count for users other than the post author
async function likeComment(req, res) {
  const comment = await prisma.comment.update({
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
        create: {
          userId: parseInt(req.body.userId),
        },
      },
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!comment) {
    res.status(200).json({
      message: 'Comment not found',
    });
  } else {
    const commentLikes = {
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      createdAt: comment.createdAt,
      content: comment.content,
      likes: comment._count.likes,
    };

    res.status(200).json({
      commentLikes,
    });
  }
}

// Delete the selected comment. Can be done by comment author and post author
async function deleteComment(req, res) {
  const commentToDelete = await prisma.comment.delete({
    where: {
      id: parseInt(req.params.commentId),
    },
  });

  if (!commentToDelete) {
    res.status(200).json({
      message: 'Comment not found',
    });
  } else {
    res.status(200).json({
      commentToDelete,
      message: 'Comment deleted',
    });
  }
}

export default { createComment, getComment, likeComment, deleteComment };
