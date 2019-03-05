// import express library
import express from 'express';
// create a variable app to uses express middleware
const app = express();
// import cors library
import cors from 'cors';
// setup app to use cors to allow users to make requests
app.use(cors());
// setup app to use express middleware to parse incoming requests that are in a JSON format
app.use(express.json());
// import short id library
import shortid from 'shortid';

// create notes dataset to be saved on server
app.locals.notes = [
    {
        id: '1',
        title: 'Trapper Keeper',
        color: 'purple',
        issues: [
        {
            id: 21,
            body: 'Finish project',
            completed: false
        },
        {
            id: 22,
            body: 'Start project',
            completed: false
        },
        {
            id: 23,
            body: 'Test project',
            completed: false
        },
        {
            id: 24,
            body: 'Deploy to Heroku',
            completed: false
        }
        ]
    },
    {
        id: '2',
        title: 'This is a great note',
        color: 'blue',
        issues: [{id: 25, body: 'beep boop', completed: true}],
    }
]

// setup a GET request for users to the path /api/v1/notes
app.get('/api/v1/notes', (req, res) => {
    // when a get request is made to this path, send a response with a status code 200 and a JSON of all the notes data.
    res.status(200).json(app.locals.notes);
});
    
// setup a POST request for users to the path /api/v1/notes
app.post('/api/v1/notes', (req, res) => {
    // destructure request title, color, and issues
    const { title, color, issues } = req.body;
    // if required parameters are not given, send an error response with a code of 422 and JSON message
    if (!title || !color || !issues) return res.status(422).json('Please provide a title and issues for your note');
    // if required parameters are given, create a new note object in the correct format
    const newNote = {
    id: shortid.generate(),
    ...req.body
    };
    // add the new note object to the notes array
    app.locals.notes.push(newNote);
     // send a response with a code of 201 and a JSON object of the new note that was added
    return res.status(201).json(newNote);
});
    
// setup a GET request for users to the path /api/v1/notes/:id (a given id)
app.get('/api/v1/notes/:id', (req, res) => {
    // when a get request is made to this path, find the note on the server with an id that matches the id given in the request path parameters
    const note = app.locals.notes.find(note => note.id == req.params.id);
    // if a matching note cannot be found, return an error response with a code of 404 and a JSON message
    if (!note) return res.status(404).json('Note not found');
    // if a matching note is found, return a response with a status code of 200 and a JSON object of the matching note
    return res.status(200).json(note);
});
   
// setup a PUT request for users to the path /api/v1/notes/:id (a given id)
app.put('/api/v1/notes/:id', (req, res) => {
    // when a put request is made to this path, destructure the title, color, and issues off the request body
    const { title, color, issues } = req.body;
    // destructure notes off app.locals on the server
    const { notes } = app.locals;
    // if required parameters are not given, send an error response with a code of 422 and JSON message
    if (!title || !color || !issues) return res.status(422).json('Please provide a title, color, and issues for your note');
    // find the index of the matching note using the given request path parameter id and the server note ids
    const index = notes.findIndex(note => note.id == req.params.id);
    // if a matching note cannot be found, send an error response code of 404 and a JSON message
    if (index === -1) return res.status(404).json('Note not found');
    // if a matching note is found, update the note object with the new data given in the request body
    const newNote = { id: notes[index].id, title, color, issues };
    // update the notes array on the server with the updated note
    notes.splice(index, 1, newNote);
    // return a successful response with a status code of 204
    return res.sendStatus(204)
})

// setup a DELETE request for users to the path /api/v1/notes/:id (a given id)
app.delete('/api/v1/notes/:id', (req, res) => {
    // when a delete request is made to this path, destructure notes off app.locals on the server
    const { notes } = app.locals;
    // find the index of the matching note using the given request path parameter id and the server note ids
    const index = notes.findIndex(note => note.id == req.params.id);
    // if a matching note cannot be found, send an error response code of 404 and a JSON message
    if (index === -1) return res.status(404).json('Note not found');
    // if a matching note is found, update the notes array on the server to remove the matching note
    notes.splice(index, 1);
    // return a successful response with a status code of 204
    return res.sendStatus(204)
})

// export app to be used in server.js file
export default app;
