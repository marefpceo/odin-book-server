import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

import logger from '../helpers/logger.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Handles returning all recent posts for user and friends
async function postsGet(req, res) {
  // Get list of current user and friend ids
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.userId),
    },
    select: {
      user1: {
        where: {
          user1Id: parseInt(req.params.userId),
          status: 'ACTIVE',
        },
      },
      user2: {
        where: {
          user2Id: parseInt(req.params.userId),
          status: 'ACTIVE',
        },
      },
    },
  });

  // Extract and store id's in an array
  const friendIds = [
    ...user.user1.map((f) => parseInt(f.user2Id)),
    ...user.user2.map((f) => parseInt(f.user1Id)),
    parseInt(req.params.userId),
  ];

  if (!user) {
    logger.error('User not found');
    res.status(404).json({
      message: 'User not found',
    });
  } else {
    // Return all posts using friendIds
    const feedPosts = await prisma.post.findMany({
      where: {
        userId: {
          in: friendIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        comment: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    res.status(200).json({
      message: feedPosts.length === 0 ? 'No posts found' : 'Success',
      feedPosts,
    });
  }
}

// Creates a new post and returns the information
async function createPost(req, res) {
  const createdPost = await prisma.post.create({
    data: {
      userId: parseInt(req.params.userId),
      content: req.body.content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      comment: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const post = {
    id: createdPost.id,
    userId: createdPost.userId,
    createdAt: createdPost.createdAt,
    updatedAt: createdPost.updatedAt,
    content: createdPost.content,
    likes: createdPost._count.likes,
    user: createdPost.user,
    comment: createdPost.comment,
  };

  logger.info(`Post ${post.id} created`);
  res.status(200).json({
    post,
    message: 'New post created',
  });
}

// Handles getting selected post
async function selectedPostGet(req, res) {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(req.params.postId),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      comment: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!post) {
    res.status(200).json({
      message: 'Post not found',
    });
  } else {
    const selectedPost = {
      id: post.id,
      userId: post.userId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      content: post.content,
      likes: post._count.likes,
      user: post.user,
      comment: post.comment,
    };

    res.status(200).json({
      selectedPost,
    });
  }
}

// Update post by creating a like record for the selected user
async function likePost(req, res) {
  const post = await prisma.post.update({
    where: {
      id: parseInt(req.params.postId),
      NOT: [
        {
          userId: parseInt(req.params.userId),
        },
      ],
    },
    data: {
      likes: {
        create: {
          userId: parseInt(req.params.userId),
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

  if (!post) {
    res.status(200).json({
      message: 'Post not found',
    });
  } else {
    const postLikes = {
      id: post.id,
      userId: post.userId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      content: post.content,
      likes: post._count.likes,
      user: post.user,
      comment: post.comment,
    };

    res.status(200).json({
      postLikes,
    });
  }
}

// Handles deleting selected post
async function deletePost(req, res) {
  const post = await prisma.post.delete({
    where: {
      id: parseInt(req.params.postId),
    },
  });

  if (!post) {
    logger.error(`Post id: ${req.params.postId} to delete not found.`);
    res.status(200).json({
      message: 'Post not found',
    });
  } else {
    logger.info(`Post id: ${req.params.postId} deleted.`);
    res.status(200).json({
      message: 'Post deleted',
    });
  }
}

export default {
  postsGet,
  selectedPostGet,
  createPost,
  likePost,
  deletePost,
};
