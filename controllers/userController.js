import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

import logger from '../helpers/logger.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Handles getting a list of all users
async function usersGet(req, res) {
  const globalUserList = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      profile: {
        select: {
          avatar: true,
        },
      },
      user1: {
        include: true,
      },
      user2: {
        include: true,
      },
    },
  });
  res.status(200).json(globalUserList);
}

// POST request to add selected user as a friend
async function addSelectedUser(req, res) {
  const friendRequest = await prisma.friendship.create({
    data: {
      user1Id: parseInt(req.params.userId),
      user2Id: parseInt(req.body.userToAdd),
    },
  });
  logger.info(
    `User ${req.params.userId} requested ${req.body.userToAdd} for friendship.`,
  );
  res.status(200).json({
    message: 'Friend request submitted.',
    friendRequest,
  });
}

// PUT request to update friendship status
async function updateFriendshipStatus(req, res) {
  const friendStatusUpdate = await prisma.friendship.update({
    where: {
      user2Id_user1Id: {
        user2Id: parseInt(req.params.userId),
        user1Id: parseInt(req.body.user1Id),
      },
    },
    data: {
      status: req.body.status,
    },
  });

  res.status(200).json({
    message: 'Friendship accepted',
    friendStatusUpdate,
  });
}

// Handles DELETE request to remove selected user from friend's list
async function removeFriend(req, res) {
  const removeFromFriendList = await prisma.friendship.delete({
    where: {
      user2Id_user1Id: {
        user1Id: parseInt(req.body.user1Id),
        user2Id: parseInt(req.body.user2Id),
      },
    },
  });
  res.status(200).json({
    message: 'User removed',
    removeFromFriendList,
  });
}

export default {
  usersGet,
  addSelectedUser,
  updateFriendshipStatus,
  removeFriend,
};
