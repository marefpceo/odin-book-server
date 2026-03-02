import app from '../app';
import request from 'supertest';
import express from 'express';
import { beforeAll, describe, expect, test } from 'vitest';
import userRouter from '../routers/userRouter.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

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
    const res = await request(app).get('/users');

    expect(res.status).toEqual(200);
    expect(res.body.globalUserList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
          user2: expect.any(Array),
        }),
      ]),
    );
  });

  test('should submit a friend request for the selected user', async () => {
    const res = await request(app)
      .post(`/users/${jimmyOne.id}/add`)
      .send({ userToAdd: `${billy.id}` });

    console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Friend request submitted.');
  });

  test('should show the friendship was accepted by updating status to ACTIVE', async () => {
    const res = await request(app).put(`/users/${billy.id}/update`).send({
      status: 'ACTIVE',
      user1Id: jimmyOne.id,
    });

    console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Friendship accepted');
  });

  test('should show the friendship was ended', async () => {
    const res = await request(app).del(`/users/`);
  });
});
