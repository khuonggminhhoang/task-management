const express = require('express');
const router = express.Router();
const controller = require('./../controllers/task.controller'); 

const middlewareAuth = require('./../../../middleware/auth.middleware');

router.get('/', middlewareAuth.verifyToken ,controller.index);

router.get('/detail/:id', middlewareAuth.verifyToken,controller.detail);

router.patch('/change-status/:id', middlewareAuth.verifyToken, controller.changeStatus);

router.patch('/change-multi', middlewareAuth.verifyToken, controller.changeMulti);

router.post('/create', middlewareAuth.verifyToken, controller.create);

router.patch('/edit/:id', middlewareAuth.verifyToken, controller.edit);

router.delete('/delete/:id', middlewareAuth.verifyToken, controller.delete);

module.exports = router;