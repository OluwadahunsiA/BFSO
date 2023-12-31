const mongoose = require('mongoose');

const assert = require('assert');

const supertest = require('supertest');
const helper = require('./test_helper');

const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});

  console.log('cleared');

  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());

  await Promise.all(promiseArray);

  console.log('done');
});

describe('when there are some notes saved', () => {
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

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map((r) => r.content);

    expect(contents).toContain('Browser can execute only javascript');
  });
});

describe('addition of a new note', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).toContain('async/await simplifies making async calls');
  });

  test('note without content is not added', async () => {
    const newNote = {
      important: true,
    };

    await api.post('/api/notes').send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe('handle specific notes', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultNote.body).toEqual(noteToView);
  });

  test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).not.toContain(noteToDelete.content);
  });

  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultNote.body).toEqual(noteToView);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5isdadfoijaojoiadsf3fef';

    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
