import app from '../app';
import { describe, test, expect } from 'vitest';
import postRouter from '../routers/postRouter.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

import request from 'supertest';
import express from 'express';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', postRouter);

const jimmyOne = await prisma.user.findUnique({
  where: {
    username: 'jimmyOne',
  },
});

const billy = await prisma.user.findUnique({
  where: {
    username: 'billy',
  },
});

describe('Test post routes', async () => {
  test('that route returns all user and friends post for feed', async () => {
    const res = await request(app).get(`/posts/${jimmyOne.id}`);

    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.feedPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          userId: expect.any(Number),
          createdAt: expect.any(String),
          content: expect.any(String),
        }),
      ]),
    );
  });

  test('jimmyOne creating a new post', async () => {
    const res = await request(app).post(`/posts/${jimmyOne.id}/create`).send({
      content: 'New post. Jimmy One here!',
    });

    console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('New post created');
    expect(res.body.post).toEqual({
      id: expect.any(Number),
      userId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      content: expect.any(String),
      likes: 0,
      user: expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
      }),
      comment: [],
    });
  });

  test('billy creating a new post', async () => {
    const res = await request(app).post(`/posts/${billy.id}/create`).send({
      content: 'New post. Billy here!',
    });

    console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('New post created');
    expect(res.body.post).toEqual({
      id: expect.any(Number),
      userId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      content: expect.any(String),
      likes: 0,
      user: expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
      }),
      comment: [],
    });
  });
});
