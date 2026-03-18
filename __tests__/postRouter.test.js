import app from '../app';
import { describe, test, expect, afterAll, beforeAll } from 'vitest';
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

// Db call to get all post ids prior to running test
const seedPost = await prisma.post.findMany({
  select: {
    id: true,
  },
});

const postExpectedResults = {
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
};

// List of post Id's generated from seed file to not delete after testing
const cleanUpIds = seedPost.map((record) => record.id);

describe('Test post routes', async () => {
  let postToDeleteResult = {};
  afterAll(async () => {
    await prisma.post.deleteMany({
      where: {
        id: {
          notIn: cleanUpIds,
        },
      },
    });
  });

  test('that route returns all user and friends post for feed', async () => {
    const res = await request(app).get(`/posts/${jimmyOne.id}`);

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

    postToDeleteResult = await res.body.post.id;
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('New post created');
    expect(res.body.post).toEqual(postExpectedResults);
  });

  test('billy creating a new post', async () => {
    const res = await request(app).post(`/posts/${billy.id}/create`).send({
      content: 'New post. Billy here!',
    });

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('New post created');
    expect(res.body.post).toEqual(postExpectedResults);
  });

  describe('test like post function and reset like counter to zero', async () => {
    // clears the created like record
    afterAll(async () => {
      await prisma.post_Like.deleteMany({});
    });

    const postId = await prisma.user.findUnique({
      where: {
        id: parseInt(jimmyOne.id),
      },
      include: {
        post: {
          select: {
            id: true,
          },
        },
      },
    });

    test('create a like for the selected post and increase the count by one', async () => {
      const res = await request(app).put(
        `/posts/${billy.id}/${postId.post[0].id}/like`,
      );

      expect(res.status).toEqual(200);
      expect(res.body.postLikes).toEqual({
        id: expect.any(Number),
        userId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        content: expect.any(String),
        likes: 1,
      });
    });
  });

  describe('getting selected post and deleting it', async () => {
    test('returning the selected post to view and or initiate comment', async () => {
      const res = await request(app).get(`/posts/${billy.id}/${cleanUpIds[0]}`);

      expect(res.status).toEqual(200);
      expect(res.body.selectedPost).toEqual(postExpectedResults);
    });

    test('deleting selected post that was just created', async () => {
      const res = await request(app).delete(
        `/posts/${billy.id}/${postToDeleteResult}/delete`,
      );

      expect(res.status).toEqual(200);
      expect(res.body.message).toEqual('Post deleted');
    });
  });
});
