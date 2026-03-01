import app from '../app';
import request from 'supertest';
import express from 'express';
import { describe, expect, test } from 'vitest';
import userRouter from '../routers/userRouter.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', userRouter);

describe('Test all routes in userRouter', async () => {
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
});
