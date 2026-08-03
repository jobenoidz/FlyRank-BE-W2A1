const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const INIT_TASKS = [
    { id: 1, title: "Cook breakfast", done: false },
    { id: 2, title: "Set appointment", done: true },
    { id: 3, title: "Clean bedroom", done: false },
]

const tasks = INIT_TASKS.map((task) => ({ ...task }));


//Stage 1
app.get('/', (req, res) => {
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get('/health', (req, res) => {
    res.send({ "status": "ok" });
});


//Stage 2
app.get('/tasks', (req, res) => {
    res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` })
    }

    res.json(task)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});