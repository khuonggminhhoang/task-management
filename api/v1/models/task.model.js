const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    createdBy: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');