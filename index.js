const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// In-memory database (array)
let todos = [
  { id: 1, title: 'Belajar SSH', done: true },
  { id: 2, title: 'Deploy Node.js ke VPS', done: false },
  { id: 3, title: 'Belajar PM2', done: false },
]
let nextId = 4

// ===== ROUTES =====

// GET / - info API
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API berjalan!',
    endpoints: {
      'GET    /todos':        'ambil semua todo',
      'GET    /todos/:id':    'ambil todo by id',
      'POST   /todos':        'buat todo baru',
      'PUT    /todos/:id':    'update todo',
      'DELETE /todos/:id':    'hapus todo',
    }
  })
})

// GET /todos - ambil semua
app.get('/todos', (req, res) => {
  res.json({ data: todos, total: todos.length })
})

app.get('/todos/filter', (req, res) => {
  const { done } = req.query
  if (done === undefined) return res.json({ data: todos })
  const filtered = todos.filter(t => t.done === (done === 'true'))
  res.json({ data: filtered, total: filtered.length })
})

// GET /todos/:id - ambil by id
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id))
  if (!todo) return res.status(404).json({ error: 'Todo tidak ditemukan' })
  res.json({ data: todo })
})

// POST /todos - buat baru
app.post('/todos', (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title wajib diisi' })
  const todo = { id: nextId++, title, done: false }
  todos.push(todo)
  res.status(201).json({ message: 'Todo berhasil dibuat', data: todo })
})

// PUT /todos/:id - update
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id))
  if (!todo) return res.status(404).json({ error: 'Todo tidak ditemukan' })
  const { title, done } = req.body
  if (title !== undefined) todo.title = title
  if (done !== undefined) todo.done = done
  res.json({ message: 'Todo berhasil diupdate', data: todo })
})

// DELETE /todos/:id - hapus
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Todo tidak ditemukan' })
  const deleted = todos.splice(index, 1)[0]
  res.json({ message: 'Todo berhasil dihapus', data: deleted })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`)
  console.log(`Tekan Ctrl+C untuk stop`)
})