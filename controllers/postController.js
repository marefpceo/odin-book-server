import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

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
    },
  });

  res.status(200).json({
    message: feedPosts.length === 0 ? 'No posts found' : '',
    feedPosts,
  });
}

// Creates a new post and returns the information
async function createPost(req, res) {
  const post = await prisma.post.create({
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
    },
  });

  res.status(200).json({
    post,
    message: 'New post created',
  });
}

// Handles getting selected post
async function selectedPostGet(req, res) {
  const selectedPost = await prisma.post.findUnique({
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
    },
  });

  res.status(200).json({
    selectedPost,
  });
}

// Handles deleting selected post
async function deletePost(req, res) {
  await prisma.post.delete({
    where: {
      id: parseInt(req.params.postId),
    },
  });
  res.status(200).json({
    message: 'Post deleted',
  });
}

export default {
  postsGet,
  selectedPostGet,
  createPost,
  deletePost,
};
