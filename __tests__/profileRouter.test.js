import app from '../app.js';
import fs from 'fs/promises';
import path from 'node:path';
import { afterAll, describe, expect, test } from 'vitest';
import profileRouter from '../routers/profileRouter.js';

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

describe('Test all routes in profileRouter', async () => {
  afterAll(async () => {
    // Clear uploads directory from testing image uploads
    try {
      const files = await fs.readdir(uploadDirectory);

      for (const file of files) {
        const filePath = path.join(uploadDirectory, file);
        const stat = await fs.stat(filePath);

        if (stat.isFile()) {
          await fs.unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        } else if (stat.isDirectory()) {
          await fs.rm(filePath, { recursive: true, force: true });
          console.log(`Removed subdirectory: ${filePath}`);
        }
      }
      console.log(`Emptied directory: ${uploadDirectory}`);
    } catch (err) {
      console.log(`Error removing directory: ${err}`);
    }
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
    const res = await request(app)
      .post(`/profile/create`)
      .field('userId', katieUserId.id)
      .field('firstname', 'Kate')
      .field('lastname', 'Did')
      .field('bio', 'Everyone knows Katie Did')
      .attach('avatar', testFilePath);
    console.log(res.body);
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

    const res = await request(app)
      .put(`/profile/${katieProfileId.profile.id}/update`)
      .field('firstname', 'Katie')
      .field('lastname', 'Diddly')
      .field('bio', 'Everyone knows Kate as Katie')
      .attach('avatar', testFilePath2);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Profile successfully updated!');
  });

  test('deleting profile', async () => {
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

    const res = await request(app).delete(
      `/profile/${katieProfileId.profile.id}/delete`,
    );

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Profile deleted!');
  });
});
