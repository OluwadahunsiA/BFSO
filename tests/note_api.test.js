const mongoose = require('mongoose');

const assert = require('assert');

const supertest = require('supertest');

const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);

const initialNotes = [
  {
    content: 'HTML is easy',
    important: true,
  },

  {
    content: 'Browser can execute only javascript',
    important: false,
  },
];

beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(initialNotes[0]);

  await noteObject.save();

  noteObject = new Note(initialNotes[1]);

  await noteObject.save();
});

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

test('there are some notes in the database', async () => {
  const response = await api.get('/api/notes');

  expect(response.body.length).toBeGreaterThan(0);
});

test('the first note has an important value true', async () => {
  const response = await api.get('/api/notes');

  const first = response.body[0];

  expect(first.important).toBe(true);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map((r) => r.content);

  expect(contents).toContain('Browser can execute only javascript');
});

afterAll(async () => {
  await mongoose.connection.close();
});
