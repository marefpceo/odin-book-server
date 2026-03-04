import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function createComment(req, res) {
  res.status(200).json({
    message: 'Create Comment',
    route: '/:postId/comment/create',
  });
}

async function getComment(req, res) {
  res.status(200).json({
    message: 'Get Comment',
    route: '/:postId/comment/:commentId',
  });
}

async function likeComment(req, res) {
  res.status(200).json({
    message: 'Like Comment',
    route: '/:postId/comment/:commentId/like',
  });
}

async function deleteComment(req, res) {
  res.status(200).json({
    message: 'Delete Comment',
    route: '/:postId/comment/:commentId/delete',
  });
}

export default { createComment, getComment, likeComment, deleteComment };
