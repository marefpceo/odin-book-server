import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Handles returning all recent posts for user and friends
async function postsGet(req, res) {
  // Get current user and list of friends ids
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.userId),
    },
    select: {
      user1: {
        where: {
          user1Id: parseInt(req.params.userId),
        },
      },
      user2: {
        where: {
          user2Id: parseInt(req.params.userId),
        },
      },
    },
  });

  const friendIds = [
    ...user.user1.map((f) => parseInt(f.user2Id)),
    ...user.user2.map((f) => parseInt(f.user1Id)),
    parseInt(req.params.userId),
  ];

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

// Handles getting selected post
async function selectedPostGet(req, res) {
  res.json({
    title: 'GET selected post route',
    postId: req.params.postId,
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
      user: true,
      comment: true,
    },
  });

  res.status(200).json({
    post,
    message: 'New post created',
  });
}

// Handles updating selected post
async function updatePostPut(req, res) {
  res.json({ title: 'PUT post/update route' });
}

// Handles updating selected post
async function deletePost(req, res) {
  res.json({ title: 'DELETE post/delete route' });
}

export default {
  postsGet,
  selectedPostGet,
  createPost,
  updatePostPut,
  deletePost,
};
