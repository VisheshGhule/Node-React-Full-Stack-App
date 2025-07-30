const express = require('express');
const app = express();
const port = 4000;

const tasks = {};

app.use(express.json());

// Serve static files if you want backend to serve frontend (optional)
// app.use(express.static('build'));

// Optional: Add a root route for browser friendliness
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { task_id, task_name } = req.body;
  if (!task_id || !task_name) {
    return res.status(400).json({ error: 'task_id and task_name are required' });
  }
  tasks[task_id] = { taskName: task_name, status: 'undone' };
  res.status(201).json(tasks[task_id]);
});

app.delete('/tasks/:id', (req, res) => {
  const task_id = req.params.id;
  if (tasks[task_id]) {
    delete tasks[task_id];
    return res.status(204).send();
  }
  res.status(404).json({ error: 'Task not found' });
});

app.listen(port, () => {
  console.log(`Todo app listening at http://localhost:${port}`);
  console.log('GET    ---   /tasks');
  console.log('POST   ---   /tasks');
  console.log('DELETE ---   /tasks/:id');
});
