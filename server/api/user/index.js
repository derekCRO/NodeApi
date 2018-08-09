'use strict';

var express = require('express');
var controller = require('./user.controller');
var router = express.Router();

router.get('/me', controller.me);
router.post('/', controller.create);
router.put('/:id/key', controller.updateKey);
router.put('/:id/update', controller.updateInfo);
router.put('/:id/password', controller.updatePwd);

module.exports = router;
