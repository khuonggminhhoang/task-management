const Task = require('./../models/task.model');
const User = require('./../models/user.model');

const paginationHelper = require('./../../../helpers/pagination.helper');
const searchHelper = require('./../../../helpers/search.helper');

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const objectFilter = {
        deleted: false,
        createdBy: req.user.id
    } 

    if(req.query.status) {
        objectFilter.status = req.query.status;
    }

    // Search
    if(req.query.keyword) {
        const objectSearch = searchHelper(req.query);
        objectFilter.title = objectSearch.regex;
    }
    // End Search

    // Sort
    const objectSort = {};
    if(req.query.sortKey && req.query.sortValue) {
        objectSort[req.query.sortKey] = req.query.sortValue;
    }
    // End sort 

    // Pagination
    const countPage = await Task.countDocuments(objectFilter);
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
            deleted: false,
            createdBy: req.user.id
        });

        res.json(task);
    }
    catch (err) {
        res.json({
            code: 400,
            message: 'Bad Request'
        });
    }

}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    const taskId = req.params.id;
    const status = req.body.status;
    
    try {
        await Task.updateOne({
            _id: taskId,
            createdBy: req.user.id
        }, {
            status: status
        })

        res.json({
            code: 200,
            message: 'OK'
        })
    }
    catch (err) {
        res.json({
            code: 400,
            message: 'Bad Request'
        });

    }

}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids;
    const key = req.body.key;
    const value = req.body.value;
    
    try {
        switch(key) {
            case 'status': 
                await Task.updateMany({
                    _id: {$in: ids},
                    createdBy: req.user.id
                }, {
                    status: value
                });
                break;

            case 'deleted':
                await Task.updateMany({
                    _id: {$in : ids},
                    createdBy: req.user.id
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                break;
            
            default:
                break;
        }

        res.json({
            code: 200,
            message: 'OK',
        })

    }
    catch(err) {
        res.json({
            code: 400,
            message: 'Bad Request'
        })
    }

    
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const task = new Task(req.body);
        await task.save();
        res.json({
            code: 200,
            message: "OK",
            data: task
        });
    }
    catch(err) {
        res.json({
            code: 400,
            message: 'Bad Request'
        });
    }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        await Task.updateOne({
            _id: id,
            createdBy: req.user.id
        }, req.body);

        res.json({
            code: 200,
            message: "OK",
        });

    }
    catch(err) {
        res.json({
            code: 400,
            message: 'Bad Request'
        });
    }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Task.updateOne({_id: id}, {
            deleted: true
        });

        res.json({
            code: 200,
            message: "OK",
        });
    }
    catch(err) {
        res.json({
            code: 400,
            message: 'Bad Request'
        });
    }
}