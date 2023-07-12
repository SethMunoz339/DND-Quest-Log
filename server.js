const express = require('express');
const path = require('path');
const {
  getNotes,
  saveNote,
  deleteNote
} = require('./public/assets/js/index'); 

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await getNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const newNote = req.body;
    await saveNote(newNote);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    await deleteNote(noteId);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);