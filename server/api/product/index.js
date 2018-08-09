'use strict';

var express = require('express');
var controller = require('./product.controller');
var router = express.Router();

router.get('/featured', controller.getFeatured);
router.get('/all', controller.getAllBySurface);
router.get('/detail', controller.getDetail);

module.exports = router;
