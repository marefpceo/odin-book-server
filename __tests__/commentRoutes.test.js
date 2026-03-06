import app from '../app.js';
import { describe, test, expect } from 'vitest';
import postRouter from '../routers/postRouter.js';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';

import request from 'supertest';
import express from 'express';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', postRouter);

// Get user info for billy
const billy = await prisma.user.findUnique({
  where: {
    username: 'billy',
  },
});

// Get user info for jimmyOne
const jimmyOne = await prisma.user.findUnique({
  where: {
    username: 'jimmyOne',
  },
  include: {
    post: true,
  },
});

describe('Test comment routes and controllers', async () => {
  const postId = jimmyOne.post[0].id;
  let commentId = {};
  test('route to create a comment from billy to jimmyOne post', async () => {
    const res = await request(app)
      .post(`/posts/${postId}/comment/create`)
      .send({
        userId: billy.id,
        content: 'Welcome Jimmy!',
      });

    commentId = await res.body.comment.id;
    expect(res.status).toEqual(200);
    expect(res.body.comment).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        postId: jimmyOne.post[0].id,
        userId: billy.id,
        createdAt: expect.any(String),
        content: 'Welcome Jimmy!',
        likes: 0,
      }),
    );
  });

  test('get created comment from billy to jimmyOne post', async () => {
    const res = await request(app).get(`/posts/${postId}/comment/${commentId}`);

    expect(res.status).toEqual(200);
    expect(res.body.comment).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        postId: jimmyOne.post[0].id,
        userId: billy.id,
        createdAt: expect.any(String),
        content: 'Welcome Jimmy!',
        likes: 0,
      }),
    );
  });

  test('updating likes for the comment from billy to jimmyOne post', async () => {
    const res = await request(app)
      .put(`/posts/${postId}/comment/${commentId}/like`)
      .send({ userId: jimmyOne.id });

    expect(res.status).toEqual(200);
    expect(res.body.commentLikes).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        postId: jimmyOne.post[0].id,
        userId: billy.id,
        createdAt: expect.any(String),
        content: 'Welcome Jimmy!',
        likes: 1,
      }),
    );
  });

  test('delete comment that was created', async () => {
    const res = await request(app).delete(
      `/posts/${postId}/comment/${commentId}/delete`,
    );

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Comment deleted');
  });
});
