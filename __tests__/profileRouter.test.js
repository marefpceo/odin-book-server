import app from '../app.js';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import profileRouter from '../routers/profileRouter.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

import request from 'supertest';
import express from 'express';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', profileRouter);

describe('Test all routes in profileRouter', async () => {
  const testUserId = await prisma.user.findUnique({
    where: {
      username: 'katiedid',
    },
    include: {
      profile: {
        select: {
          id: true,
        },
      },
    },
  });

  const profileId = 0 || testUserId.profile?.id;

  test('GET route to return profile by profileId', async () => {
    const res = await request(app).get(`/profile/${profileId}`);
    console.log(testUserId.profile?.id);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      username: 'katiedid',
      email: 'kate@test.com',
      password: expect.any(String),
      role: 'USER',
      profile: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
