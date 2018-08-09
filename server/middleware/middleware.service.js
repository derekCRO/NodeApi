var express = require('express')
  , passport = require('passport')
  , flash = require('connect-flash')
  , util = require('util')
  , LocalStrategy = require('passport-localapikey').Strategy
  , db = require('../dbconnection.js');

function findByApiKey(apikey, fn) {
  var query = 'SELECT * FROM users WHERE apikey = "' + apikey + '"';
  db.query(query  ,function(err,rows){
    if(err) {
      return fn(err, null);
    }
    if (rows[0] != undefined)
      return fn(null,rows[0]);
    else
      return fn(null,null);
  });
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function (apikey, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByApiKey(apikey, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown apikey : ' + apikey }); }
        return done(null, user);
      })
    });
  }
));

exports = module.exports = passport;
