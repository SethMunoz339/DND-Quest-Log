const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const fs = require('fs');
const utils = require('util')
const readFile = utils.promisify(fs.readFile)
const writeFile = utils.promisify(fs.writeFile)
const { v4: uuidv4 } = require('uuid');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

function getNotes() {
  return readFile('db/db.json', 'utf-8').then(rawNotes => [].concat(JSON.parse(rawNotes)))
}

function saveNotes(notes) {
  return writeFile('db/db.json', JSON.stringify(notes))
}

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await getNotes();
    return res.json(notes);
  
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const newNote = {title: req.body.title, text: req.body.text, id:uuidv4()};
    const oldNotes = await getNotes()
    const noteArray = [...oldNotes, newNote]
    console.log(noteArray)
    await saveNotes(noteArray);
    res.status(200).json({message: 'succesfully saved notes'})
  } catch (error) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const oldArray = await getNotes();
    const newArray = oldArray.filter(note => note.id !== noteId);
    saveNotes(newArray).then(() => res.status(200).send());
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);