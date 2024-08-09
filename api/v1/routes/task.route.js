const express = require('express');
const router = express.Router();


const Task = require('./../../../models/task.model');

router.get('/', async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
});

router.get('/detail/:id', async (req, res) => {
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

module.exports = router;