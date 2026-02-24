import { describe, expect, test } from 'vitest';
import authRouter from '../routers/authRouter.js';
import app from '../app.js';

import request from 'supertest';
import express from 'express';

app.use(express.urlencoded({ extended: false }));
app.use('/', authRouter);

const testUser = {
  username: 'testuser',
  email: 'testuser@test.com',
  password: 'kkkkkkkkk',
};

const testUserProfile = {
  username: 'profiletest',
  email: 'profiletest@test.com',
  password: 'kkkkkkkkk',
  firstname: 'Profile',
  lastname: 'Test',
  avatar: null,
  bio: 'Profile test user',
};

// Describes overall test
describe('Test Authentication Routes', () => {
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
  test('should indicate successful login with seeded user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'james1@test.com',
        password: 'kkkkkkkkk',
      })
      .set('Accept', 'x-www-form-urlencoded');

    console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.message).toBe('Login successful');
  });

  // /********** Create user with NO profile ***********/
  // /**************************************************/
  // test('should create a user with no profile', async () => {
  //   const res = await request(app)
  //     .post('/signup')
  //     .send(testUser)
  //     .set('Accept', 'x-www-form-urlencoded');

  //   expect(res.status).toEqual(200);
  //   expect(res.body).toEqual({
  //     id: expect.any(Number),
  //     username: 'testuser',
  //     email: 'testuser@test.com',
  //     password: 'kkkkkkkkk',
  //     status: 'ACTIVE',
  //     role: 'USER',
  //     profile: null,
  //     createdAt: expect.anything(Date),
  //     updatedAt: expect.anything(Date),
  //   });
  // });

  // /************ Create user with profile ************/
  // /**************************************************/
  // test('should create a user with a profile', async () => {
  //   const res = await request(app).post('/signup').send(testUserProfile);

  //   expect(res.status).toEqual(200);
  //   expect(res.body).toEqual({
  //     id: expect.any(Number),
  //     username: 'profiletest',
  //     email: 'profiletest@test.com',
  //     password: 'kkkkkkkkk',
  //     status: 'ACTIVE',
  //     role: 'USER',
  //     profile: {
  //       id: expect.any(Number),
  //       firstname: 'Profile',
  //       lastname: 'Test',
  //       avatar: null,
  //       bio: 'Profile test user',
  //       createdAt: expect.anything(Date),
  //       updatedAt: expect.anything(Date),
  //     },
  //     createdAt: expect.anything(Date),
  //     updatedAt: expect.anything(Date),
  //   });
  // });
});
