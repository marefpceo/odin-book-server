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

describe('Test post routes', async () => {
  test('that route returns no posts', async () => {
    const res = await request(app).get(`/posts/${jimmyOne.id}`);

    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('No posts found');
  });
});
