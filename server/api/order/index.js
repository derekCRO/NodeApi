'use strict';

var express = require('express');
var controller = require('./order.controller');
var router = express.Router();

router.get('/list', controller.list);
router.get('/detail', controller.detail);
router.post('/add_item', controller.addItem);
router.post('/remove_item', controller.removeItem);

module.exports = router;
