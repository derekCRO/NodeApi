'use strict';

var express = require('express');
var controller = require('./coupon.controller');
var router = express.Router();

router.get('/details', controller.details);

module.exports = router;
