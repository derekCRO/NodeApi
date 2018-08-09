var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../../dbconnection.js');
var bcrypt = require('bcrypt');

exports.setup = function (config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      findUser(email.toLowerCase(), function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if(!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));
};

function findUser(email, callback) {
  var cb = callback;
  var query = 'SELECT distinct * FROM users WHERE email = ' + "'" +email +"'";
  db.query(query  ,function(err,user){
    if(err) {
      return cb(err, null);
    }
    if (user.length > 0){
      return cb(null, user[0]);
    }
    else{
      return cb(null,null);
    }
  });
}