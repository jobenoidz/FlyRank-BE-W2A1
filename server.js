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



//Stage 3
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (title === "" || title === null || title === undefined) {
        return res.status(400).json({ error: "Title missing" })
    };

    const last_id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id));
    const new_task = { id: (last_id + 1), title: title, done: false };

    tasks.push(new_task);
    res.status(201).json(new_task);
})

//Stage 4

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    const { title, done } = req.body;

    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` })
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No Title and Done status found." });
    }

    if (title !== undefined) {
        if (title === "" || title === null) {
            return res.status(400).json({ error: "Title missing" })
        };
        task.title = title;
    };

    if (done !== undefined) {
        if (typeof done !== 'boolean') {
            return res.status(400).json({ error: "Invalid Done value" })
        };
        task.done = done;
    };

    res.status(200).json(task);
})

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.findIndex((t) => t.id === id);

    if (task === -1) {
        return res.status(404).json({ error: `Task ${id} not found` })
    }

    tasks.splice(task, 1);
    res.status(204).send();
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});