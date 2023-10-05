const Note = require('../models/note');
const User = require('../models/user');

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

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' });
  await note.save();

  await note.deleteOne();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});

  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});

  console.log(users.map((u) => u.toJSON()));
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
