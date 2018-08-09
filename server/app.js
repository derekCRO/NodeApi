/**
 * Main application file
 */
'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var https = require('https');
var http = require('http');

// Setup server
var app = express();
require('./config/express')(app);
require('./routes')(app);
var env = app.get('env');

// Start server
if ('production' === env) {
  // Create a SECURE HTTPS service.
  https.createServer(app).listen(444, config.ip, function () {
    console.log('Express HTTPS server listening on %s, in %s mode', 444, app.get('env'));
  });
  // Redirect from http port 80 to https
  /*http.createServer(function (req, res) {
    res.writeHead(301, {'Location': config.hostname});
    res.end();
  }).listen(config.port, config.ip);*/
}

else if ('development' === env) {
  var server = http.createServer(app);
  server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

// Expose app
exports = module.exports = app;
