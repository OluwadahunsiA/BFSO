const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(express.static('dist'));

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get('/', (request, response) => {
  const content = `<div> 
   <h1>Welcome to the notes app! </h1>

   <p>There are currently around ${notes.length} entries  </p>

   <p>There are different endpoints to access from the base url: </p>

   <ul> 
   <li>GET /api/notes </li>
   <li>GET /api/notes/:id </li>
   <li>DELETE /api/notes/:id </li>
   <li>PUT /api/notes/:id </li>

   </ul>
   </div>`;

  response.send(content);
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = +request.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);

  const changeImportance = notes.find((note) => note.id === id);

  changeImportance.important = !changeImportance.important;

  notes = notes.map((note) => (note.id === id ? changeImportance : note));

  response.send(changeImportance);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
