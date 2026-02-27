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
  afterAll(async () => {
    await prisma.profile.deleteMany({
      where: {
        user: {
          NOT: {
            username: 'jimmyOne',
          },
        },
      },
    });
  });

  const katieUserId = await prisma.user.findUnique({
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

  const jamesUserId = await prisma.user.findUnique({
    where: {
      username: 'jimmyOne',
    },
    include: {
      profile: {
        select: {
          id: true,
        },
      },
    },
  });

  const profileNoId = katieUserId.profile === null ? 0 : katieUserId.profile.id;
  const profileId = jamesUserId.profile === null ? 0 : jamesUserId.profile.id;

  test('GET profile route for a user with NO profile', async () => {
    const res = await request(app).get(`/profile/${profileNoId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User has not created a profile');
  });

  test('GET profile route for a user with profile', async () => {
    const res = await request(app).get(`/profile/${profileId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      id: jamesUserId.id,
      userId: jamesUserId.id,
      firstname: 'James',
      lastname: 'Roundtree',
      avatar: 'NULL',
      bio: 'Happy go lucky who likes to fish',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('POST call to create a profile for the logged in user', async () => {
    const createProfileInfo = {
      userId: katieUserId.id,
      firstname: 'Kate',
      lastname: 'Did',
      avatar: 'Katie uploaded image',
      bio: 'Everyone knows Katie Did',
    };
    const res = await request(app)
      .post(`/profile/create`)
      .set('Accept', 'x-www-form-urlencoded')
      .send(createProfileInfo);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Profile successfully created!');
  });

  test('PUT call to update profile for the logged in user', async () => {
    const katieProfileId = await prisma.user.findUnique({
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
    const updateProfileInfo = {
      firstname: 'Katie',
      lastname: 'Diddly',
      avatar: 'Katie changed image',
      bio: 'Everyone knows Kate as Katie',
    };

    const res = await request(app)
      .put(`/profile/${katieProfileId.profile.id}/update`)
      .set('Accept', 'x-www-form-urlencoded')
      .send(updateProfileInfo);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Profile successfully updated!');
  });
});
