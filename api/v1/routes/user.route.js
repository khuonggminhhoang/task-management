const express = require('express');
const router = express.Router();

const controller = require('./../controllers/user.controller'); 

const middlewareAuth = require('./../../../middleware/auth.middleware');

router.get('/detail', middlewareAuth.verifyToken, controller.detail);

module.exports = router;