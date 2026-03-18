import app from '../app';
import request from 'supertest';
import express from 'express';
import { describe, expect, test, vi } from 'vitest';
import userRouter from '../routers/userRouter.js';
import { verifyValidSession } from '../helpers/protectRoutes.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

// Mocks verifyValidSession for protected routes
vi.mock('../helpers/protectRoutes.js', async () => ({
  verifyValidSession: vi.fn(),
}));

describe('Test all routes in userRouter', async () => {
  const jimmyOne = await prisma.user.findUnique({
    where: {
      username: 'jimmyOne',
    },
    select: {
      id: true,
    },
  });
  const billy = await prisma.user.findUnique({
    where: {
      username: 'billy',
    },
    select: {
      id: true,
    },
  });

  test('GET route to return all users', async () => {
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app).get('/users');

    expect(res.status).toEqual(200);
    expect(res.body.globalUserList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
          user1: expect.any(Array),
          user2: expect.any(Array),
        }),
      ]),
    );
  });

  test('should submit a friend request for the selected user', async () => {
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app)
      .post(`/users/${jimmyOne.id}/add`)
      .send({ userToAdd: `${billy.id}` });

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Friend request submitted.');
  });

  test('should show the friendship was accepted by updating status to ACTIVE', async () => {
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app).put(`/users/${billy.id}/update`).send({
      status: 'ACTIVE',
      user1Id: jimmyOne.id,
    });

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Friendship accepted');
  });

  test('should show the friendship was removed', async () => {
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app).del(`/users/${billy.id}/remove`).send({
      user1Id: jimmyOne.id,
      user2Id: billy.id,
    });

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('User removed');
  });
});
