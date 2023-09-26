const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as an argument');
  process.exit(1);
}

const password = process.argv[2];

const uri = `mongodb+srv://Oluwadahunsi:${password}@cluster0.jew1r.mongodb.net/noteApp`;

mongoose.set('strictQuery', false);
mongoose.connect(uri);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'It was dun or bun they spoke about last week',
  important: true,
});

note.save().then((result) => {
  console.log('note saved');

  console.log(result);

  mongoose.connection.close();
});

// Note.find({}).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });

//   mongoose.connection.close();
// });
