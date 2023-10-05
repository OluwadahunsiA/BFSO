const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);

    if (note) {
      response.json(note);
    } else {
      response.status(400).end();
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.post('/', async (request, response, next) => {
  const body = request.body;

  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  try {
    const res = await note.save();
    user.notes = user.notes.concat(res._id);
    await user.save();
    response.status(201).json(res);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    const removed = await Note.findByIdAndRemove(request.params.id);

    if (removed) response.status(204).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  try {
    const result = await Note.findByIdAndUpdate(request.params.id, note, {
      new: true,
    });
    response.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
