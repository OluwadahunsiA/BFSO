const mongoose = require('mongoose');

const assert = require('assert');

const supertest = require('supertest');

const app = require('../app');

const api = supertest(app);

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect((res) => {
      const body = res.body;
      assert(Object.prototype.hasOwnProperty.call(body, 'important'));
    });
});

afterAll(async () => {
  await mongoose.connection.close();
});
