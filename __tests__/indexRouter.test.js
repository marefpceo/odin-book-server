const indexRouter = require('../routers/indexRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Describes overall test
describe('TEST ROOT DIRECTORY ROUTES', () => {
  // Describe each test 
  it('should return root directory', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.title).toBe('Express API Template');
    });
});
  
