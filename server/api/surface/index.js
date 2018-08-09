'use strict';

var express = require('express');
var controller = require('./surface.controller');
var router = express.Router();

router.get('/parent', controller.getSurfaceParent);
router.get('/child', controller.getSurfaceChild);

module.exports = router;
