const Task = require('./../models/task.model');

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
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

}