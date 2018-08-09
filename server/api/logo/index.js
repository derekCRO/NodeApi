'use strict';

var express = require('express');
var controller = require('./logo.controller');
var router = express.Router();

router.get('/getLogoFullsize', controller.getLogoFullsize);
router.get('/getLogoCategories', controller.getLogoCategories);
router.get('/getLogoSubCategories', controller.getLogoSubCategories);
router.get('/getLogosByLastname', controller.getLogosByLastname);
router.get('/getLogosByCategory', controller.getLogosByCategory);
router.get('/getLogosByLastnameCategory', controller.getLogosByLastnameCategory);
router.get('/getPopular', controller.getPopular);
router.get('/getLogoPreview', controller.getLogoPreview);
router.get('/getPreviewVideo', controller.getPreviewVideo);
router.get('/search', controller.search);

module.exports = router;
