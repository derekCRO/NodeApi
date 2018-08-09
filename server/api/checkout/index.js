'use strict';

var express = require('express');
var controller = require('./checkout.controller');
var router = express.Router();

router.post('/:cartId/shipping', controller.shipping);

module.exports = router;
