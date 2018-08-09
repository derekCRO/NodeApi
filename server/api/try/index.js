'use strict';

var express = require('express');
var controller = require('./try.controller');
var router = express.Router();

router.get('/logo', controller.getLogo);
router.get('/lastname', controller.getLastname);

module.exports = router;
