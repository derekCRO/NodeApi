'use strict';

var express = require('express');
var controller = require('./collection.controller');
var router = express.Router();

router.get('/list', controller.listCollections);
router.post('/add', controller.addToCollections);
router.delete('/remove', controller.removeFromCollections);

module.exports = router;
