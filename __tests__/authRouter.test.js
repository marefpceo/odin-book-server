import app from '../app.js';
import { afterAll, describe, expect, test } from 'vitest';
import authRouter from '../routers/authRouter.js';

import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

import request from 'supertest';
import express from 'express';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.urlencoded({ extended: false }));
app.use('/', authRouter);

// Describes overall test
describe('Test Authentication Routes', () => {
  // Clears all session data
  afterAll(async () => {
    // await prisma.session.deleteMany();
    await prisma.user.delete({ where: { username: 'testuser' } });
  });

  /************* Login seed user James **************/
  /**************************************************/
  // Login with incorrect email
  test('should return error due to incorrect email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'incorrect@email.com',
        password: 'kkkkkkkkk',
      })
      .set('Accept', 'x-www-form-urlencoded');

    expect(res.status).toEqual(401);
    expect(res.body.message).toBe('Login failed; Invalid email or password');
  });

  // Login with correct credentials
  test('should indicate successful login with seeded user James', async () => {
    const res = await request
      .agent(app)
      .post('/auth/login')
      .send({
        email: 'james1@test.com',
        password: 'kkkkkkkkk',
      })
      .set('Accept', 'x-www-form-urlencoded');

    const cookies = res.headers['set-cookie'];

    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.message).toBe('Login successful');

    const logoutRes = await request
      .agent(app)
      .post('/auth/logout')
      .set('Cookie', cookies);

    expect(logoutRes.status).toEqual(200);
  });

  /**************** Create new user *****************/
  /**************************************************/
  test('should create a user with no profile', async () => {
    const res = await request
      .agent(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'kkkkkkkkk',
        confirmPassword: 'kkkkkkkkk',
      })
      .set('Accept', 'x-www-form-urlencoded');

    const cookies = res.headers['set-cookie'];

    expect(res.status).toEqual(200);
    expect(res.body.createdUser).toEqual({
      id: expect.any(Number),
      username: 'testuser',
      email: 'testuser@test.com',
      password: expect.any(String),
      role: 'USER',
      profile: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const logoutRes = await request
      .agent(app)
      .post('/auth/logout')
      .set('Cookie', cookies);

    expect(logoutRes.status).toEqual(200);
  });
});
