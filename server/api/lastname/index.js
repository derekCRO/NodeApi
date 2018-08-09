'use strict';

var express = require('express');
var controller = require('./lastname.controller');
var router = express.Router();

router.get('/details', controller.details);
router.get('/list', controller.list);
router.post('/request', controller.request);

module.exports = router;
