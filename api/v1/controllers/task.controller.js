const Task = require('./../models/task.model');

const paginationHelper = require('./../../../helpers/pagination.helper');

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const objectFilter = {
        deleted: false
    } 

    if(req.query.status) {
        objectFilter.status = req.query.status;
    }

    // Sort
    const objectSort = {};
    if(req.query.sortKey && req.query.sortValue) {
        objectSort[req.query.sortKey] = req.query.sortValue;
    }
    // End sort 

    // Pagination
    const countPage = await Task.countDocuments({deleted: false});
    let objectPagination = {
        page: 1,
        skip: 0,
        limit: 2
    }

    objectPagination = paginationHelper(req.query, objectPagination, countPage);
    // End pagination

    const tasks = await Task.find(objectFilter)
                            .sort(objectSort)
                            .skip(objectPagination.skip)
                            .limit(objectPagination.limit);

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