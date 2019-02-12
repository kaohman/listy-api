import express from "express"
const app = express()
app.use(express.json())
app.set("port", 3001)

app.locals.notes = [
  {
    id: 1,
    title: "Trapper Keeper",
    issues: [
      {
        body: "Finish project",
        completed: false
      },
      {
        body: "Start project",
        completed: false
      },
      {
        body: "Test project",
        completed: false
      },
      {
        body: "Deploy to Heroku",
        completed: false
      }
    ]
  }
]

app.listen(app.get("port"), () => {
  console.log(app.locals.notes)
  console.log(`App is running on http://localhost:${app.get("port")}.`)
})

app.get('/api/v1/notes', (req, res) => {
  res.status(200).json(app.locals.notes)
})

app.post('/api/v1/notes', (req, res) => {
  const { title, issues } = req.body
  if (!title || !issues) return res.status(422).json('Please provide a title and issues for your note')
  const newNote = {
    id: Date.now(),
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