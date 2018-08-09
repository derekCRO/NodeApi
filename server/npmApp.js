/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var mysql = require('mysql');

// Setup server
var app = express();
require('./routes')(app);

// serve http or https
var server;
if(config.env==='production' || config.env==='staging'){
  server = require('http').createServer(app);
} else {
  server = require('http').createServer(app);
}

// Start server

/*server.listen(config.port, config.ip, function () {
    console.log('Express server listening ');
  });*/

// Expose app
exports = module.exports = app;
