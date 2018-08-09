/**
 * Main application routes
 */

'use strict';

var path = require('path');
var errors = require('./components/errors');
var middleware =require('./middleware/middleware.service.js');

module.exports = function (app) {

  /*app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, content-type, Access-Control-Allow-Origin');
      res.setHeader('Access-Control-Allow-Credentials', true);
      if ('OPTIONS' == req.method) {
        return res.sendStatus(204);
      } else {
        next();
      }
    });*/
    app.use(middleware.initialize());
    app.use(middleware.session());

    // Insert routes below
    app.use('/auth', require('./auth'));
    app.use('/users', require('./api/user'));
    app.use('/lastname', middleware.initialize(), middleware.authenticate('localapikey', {session: false, scope: []}), require('./api/lastname'));
    app.use('/logo', middleware.initialize(), middleware.authenticate('localapikey', {session: false, scope: []}), require('./api/logo'));
    app.use('/product', middleware.initialize(), middleware.authenticate('localapikey', {session: false, scope: []}), require('./api/product'));
    app.use('/surface', middleware.initialize(), middleware.authenticate('localapikey', {session: false, scope: []}), require('./api/surface'));
    app.use('/coupon', middleware.initialize(), middleware.authenticate('localapikey', {session: false, scope: []}), require('./api/coupon'));
    app.use('/checkout', middleware.initialize(), middleware.authenticate('localapikey', {session: false, scope: []}), require('./api/checkout'));
    app.use('/collection', require('./api/collection'));
    app.use('/order', require('./api/order'));

    app.get('/api/unauthorized', function(req, res){
      res.json({ message: "Authentication Error" })
    });

    // All undefined asset or api routes should return a 404
    /*app.route('/:url(api|auth|components|app|bower_components|assets)/*')
     .get(errors[404]);*/

    // Try routes
    app.use('/try', require('./api/try'));

    // All other routes should redirect to the index.html
    app.route('/*').get(function (req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
