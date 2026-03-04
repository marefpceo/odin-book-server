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
        select: {
          user1: true,
        },
      },
    },
  });

  const friendIds = user.user1.map((f) => parseInt(f.id));
  const userAndFriendIds = [...friendIds, parseInt(req.params.userId)];

  // Get all posts by user IDs
  const feedPosts = await prisma.post.findMany({
    where: {
      userId: {
        in: userAndFriendIds,
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
    feedPosts,
    message: feedPosts.length === 0 ? 'No posts found' : '',
  });
}

// Handles getting selected post
async function selectedPostGet(req, res) {
  res.json({
    title: 'GET selected post route',
    postId: req.params.postId,
  });
}

// Handles getting info needed to create or update a post
async function createPostGet(req, res) {
  res.json({ title: 'GET post/create Route' });
}

// Handles getting info needed to create or update a post
async function createPostPost(req, res) {
  res.json({ title: 'POST post/create Route' });
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
  createPostGet,
  createPostPost,
  updatePostPut,
  deletePost,
};
