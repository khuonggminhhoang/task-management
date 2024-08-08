const express = require('express');

require('dotenv').config();

const database = require('./config/database');

const Task = require('./model/task.model');

database.connect();
const app = express();

app.get('/', async (req, res) => {
    res.send('Test API /tasks');
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
});

app.get('/tasks/detail/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOne({
            _id: taskId,
            deleted: false
        });

        res.json(task);
    }
    catch (err) {
        res.json({ code: 404 });
    }

});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
})