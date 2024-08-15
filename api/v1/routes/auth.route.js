const express = require('express');
const router = express.Router();

const controller = require('./../controllers/auth.controller');
const validate = require('./../../../validate/user.validate');

router.post('/register', validate.register, controller.register);

router.post('/login', validate.login, controller.login);

router.post('/refresh-token', controller.refreshTokenRequired);

module.exports = router;