import app from '../app.js';
import path from 'node:path';
import { describe, expect, test, vi, afterEach, beforeAll } from 'vitest';
import profileRouter from '../routers/profileRouter.js';
import { verifyValidSession } from '../helpers/protectRoutes.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

import request from 'supertest';
import express from 'express';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Path to Uploads directory
const uploadDirectory = './helpers/uploads';
// Test image locations used to test multer routes
const testFilePath = path.join(__dirname, 'test-image.png');
const testFilePath2 = path.join(__dirname, 'test-image2.png');

app.use(express.urlencoded({ extended: false }));
app.use('/', profileRouter);

vi.mock('../helpers/protectRoutes.js', async () => ({
  verifyValidSession: vi.fn(),
}));

describe('Test all routes in profileRouter', async () => {
  afterEach(async () => {
    vi.resetAllMocks();
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
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app).get(`/profile/${profileNoId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('User has not created a profile');
  });

  test('GET profile route for a user with profile', async () => {
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app).get(`/profile/${profileId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      id: jamesUserId.profile.id,
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
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

    const res = await request(app)
      .post(`/profile/create`)
      .field('userId', katieUserId.id)
      .field('firstname', 'Kate')
      .field('lastname', 'Did')
      .field('bio', 'Everyone knows Katie Did')
      .attach('avatar', testFilePath);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Profile successfully created!');
  });

  test('PUT call to update profile for the logged in user', async () => {
    verifyValidSession.mockImplementation((req, res, next) => {
      req.session.passport = { id: 1, role: 'USER' };
      next();
    });

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

    const res = await request(app)
      .put(`/profile/${katieProfileId.profile.id}/update`)
      .field('firstname', 'Katie')
      .field('lastname', 'Diddly')
      .field('bio', 'Everyone knows Kate as Katie')
      .attach('avatar', testFilePath2);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Profile successfully updated!');
  });

  describe('test delete route with actual login data', () => {
    let kateRes;
    let cookies;
    let profileId;

    beforeAll(async () => {
      kateRes = await request.agent(app).post(`/auth/login`).send({
        email: 'kate@test.com',
        password: 'kkkkkkkkk',
      });

      cookies = kateRes.headers['set-cookie'];
      profileId = kateRes.body.user.profile;
    });

    test('deleting profile for logged in user', async () => {
      verifyValidSession.mockImplementation((req, res, next) => {
        req.session.passport.user = { id: kateRes.body.user.id, role: 'USER' };
        next();
      });

      const res = await request
        .agent(app)
        .delete(`/profile/${profileId}/delete`)
        .set('Cookie', cookies);

      expect(res.status).toEqual(200);
      expect(res.body.message).toEqual('Profile deleted');
    });
  });
});
