import { describe, expect, test } from 'vitest';
import authRouter from '../routers/authRouter.js';

import request from 'supertest';
import express from 'express';
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', authRouter);

// Describes overall test
describe('TEST ROOT DIRECTORY ROUTES', () => {
  // Describe each test
  test('should return root directory', async () => {
    const res = await request(app).get('/').expect(200);

    expect(res.body.title).toBe('Test Root Route');
  });
});
