const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    refreshToken: String,
    gender: {
        type: String,
        default: 'male'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema, 'users');