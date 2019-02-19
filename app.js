import express from "express"
const app = express()
import cors from "cors"
app.use(cors())
app.use(express.json())
import shortid from 'shortid'

app.locals.notes = [
    {
        id: '1',
        title: "Trapper Keeper",
        color: 'purple',
        issues: [
        {
            id: 21,
            body: "Finish project",
            completed: false
        },
        {
            id: 22,
            body: "Start project",
            completed: false
        },
        {
            id: 23,
            body: "Test project",
            completed: false
        },
        {
            id: 24,
            body: "Deploy to Heroku",
            completed: false
        }
        ]
    },
    {
        id: '2',
        title: "This is a great note",
        color: 'blue',
        issues: [{id: 25, body: "beep boop", completed: true}],
    }
]

app.get('/api/v1/notes', (req, res) => {
    res.status(200).json(app.locals.notes)
})
    
app.post('/api/v1/notes', (req, res) => {
    const { title, color, issues } = req.body
    if (!title || !color || !issues) return res.status(422).json('Please provide a title and issues for your note')
    const newNote = {
    id: shortid.generate(),
    ...req.body
    }
    app.locals.notes.push(newNote)
    return res.status(201).json(newNote)
})
    
app.get('/api/v1/notes/:id', (req, res) => {
    const note = app.locals.notes.find(note => note.id == req.params.id)
    if (!note) return res.status(404).json('Note not found')
    return res.status(200).json(note)
})
    
app.put('/api/v1/notes/:id', (req, res) => {
    const { title, color, issues } = req.body
    const { notes } = app.locals
    if (!title || !color || !issues) return res.status(422).json('Please provide a title and issues for your note')
    const index = notes.findIndex(note => note.id == req.params.id)
    if (index === -1) return res.status(404).json('Note not found')
    const newNote = { id: notes[index].id, title, color, issues }
    notes.splice(index, 1, newNote)
    return res.sendStatus(204)
})

app.delete('/api/v1/notes/:id', (req, res) => {
    const { notes } = app.locals
    const index = notes.findIndex(note => note.id == req.params.id)
    if (index === -1) return res.status(404).json('Note not found')
    notes.splice(index, 1)
    return res.sendStatus(204)
})

export default app;
