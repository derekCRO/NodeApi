'use strict';
var fs = require('fs');
var _ = require('lodash');
var db = require('../../dbconnection.js');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');
var bcrypt = require('bcrypt');
var fs = require('fs');

var salt = makeSalt();

var createUser = function(user, cb) {
    var query = 'SELECT * FROM users WHERE email = ' + "'" + user.email + "'";

    db.query(query, function(err, rows) {
        if (err) {
            return cb(err, null);
        }
        if (rows.length > 0) {
            var error = { 'email': 'Email is already used' };
            return cb(error, null);
        } else {
            var query = "INSERT INTO users (shop_id, active, first_name, last_name, username, email, phone, password, salt, apikey, created_on, last_login) VALUES(" + " 1, 1, '" + user.first_name + "', '" + user.last_name + "', '" + user.username + "', '" + user.email + "', '" + user.phone + "', '" + user.password + "', '" + user.salt + "', '" + user.apikey + "', '" + user.created_on + "', '" + user.last_login + "')";

            db.query(query, function(err, user) {
                if (err)
                    return cb(err, null);
                else
                    return cb(null, user);
            });
        }
    });
};

var currentUser = function(id, cb) {
    var query = 'SELECT * FROM users WHERE id = ' + id;

    db.query(query, function(err, rows) {
        if (err) {
            return cb(err, null);
        }
        if (rows[0] != undefined) {
            return cb(null, rows[0]);
        } else {
            var error = { 'user': 'No exists' };
            return cb(error, null);
        }
    });
};

var isAuthenticated = function(req) {
    if (req.headers && req.headers.token) {
        var token = req.headers.token,
            decoded;
        try {
            decoded = jwt.verify(token, config.secrets.session);
        } catch (e) {
            return false;
        }
        return true;
    }
    return false;
};

exports.createUser = createUser;
exports.currentUser = currentUser;
exports.isAuthenticated = isAuthenticated;

/**
 * Creates a new user (from signup page)
 */
exports.create = function(req, res, next) {
    var userInfo = req.body;
    userInfo.phone = req.body.phone == undefined ? '' : req.body.phone;
    userInfo.created_on = userInfo.last_login = Math.round((new Date()).getTime() / 1000);
    userInfo.password = encryptPassword(userInfo.password);
    userInfo.salt = salt;
    userInfo.apikey = makeString(30);

    createUser(userInfo, function(err, user) {
        if (err) {
            console.log(err);
            return handleError(res, err);
        }
        var token = jwt.sign({ _id: user.insertId }, config.secrets.session, { expiresIn: 60 * 60 * 5 });
        res.json({ token: token });
    });
};

/**
 * Get current user
 */
exports.me = function(req, res, next) {
    if (req.headers && req.headers.token) {
        var token = req.headers.token,
            decoded;
        try {
            decoded = jwt.verify(token, config.secrets.session);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        var userId = decoded._id;

        currentUser(userId, function(err, user) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(user);
        });
    } else {
        return res.status(401).send('no token');
    }
};


/**
 * Update key
 */
exports.updateKey = function(req, res, next) {
    if (isAuthenticated(req)) {
        var id = req.param('id');
        currentUser(id, function(err, user) {
            if (err) {
                return handleError(res, err);
            }
            var key = makeString(30);
            var query = "Update users SET apikey = '" + key + "' WHERE id = " + id;

            db.query(query, function(err, user) {
                if (err)
                    return handleError(res, err);
                else
                    return res.json({ key: key });
            });
        });
    } else {
        return handleError(res, 'unauthorized');
    }
};


/**
 * Update Info
 */
exports.updateInfo = function(req, res, next) {
    if (isAuthenticated(req)) {
        var id = req.param('id');
        currentUser(id, function(err, user) {
            if (err) {
                return handleError(res, err);
            }
            var userInfo = req.body;
            if (!userInfo.email){
                return handleError(res, 'Empty email address');
            }
            var query = 'SELECT * FROM users WHERE email = ' + "'" + userInfo.email + "' AND id != " + id;
            db.query(query, function(err, rows) {
                if (err) {
                    return handleError(res, err);
                }
                if (rows.length > 0) {
                    return handleError(res, 'Email is already used');
                } else {
                    userInfo.company = userInfo.company ? userInfo.company : '';
                    query = "Update users SET username = '" + userInfo.username + "', first_name = '" + userInfo.first_name + "', last_name = '" + userInfo.last_name + "', email = '" + userInfo.email + "', phone = '" + userInfo.phone + "', company = '" + userInfo.company + "' WHERE id = " + id;

                    db.query(query, function(err, user) {
                        if (err)
                            return handleError(res, err);
                        else
                            return res.json(userInfo);
                    });
                }
            });
        });
    } else {
        return handleError(res, 'unauthorized');
    }
};


/**
 * Update Password
 */
exports.updatePwd = function(req, res, next) {

    if (isAuthenticated(req)) {

        var id = req.params.id;
        var password = req.query.oldPassword;
        var new_password = req.query.newPassword;
        var isCompare = false;
        
        currentUser(id, function(err, user) {
            if (err) {
                return handleError(res, err);
            }
            try {
                isCompare = bcrypt.compareSync(password, user.password);
            } catch(error) {
                return handleError(res, error);
            }
            if (!isCompare) {
                return handleError(res, 'Old Password is wrong.');
            }
            var query = "Update users SET password = '" + encryptPassword(new_password) + "', salt = '" + salt + "' WHERE id = " + id;

            db.query(query, function(err, user) {
                if (err)
                    return handleError(res, err);
                else
                    return res.json({ success: true });
            });
        });
    } else {
        return handleError(res, 'unauthorized');
    }
};

function makeSalt() {
    return bcrypt.genSaltSync(10);
}

function makeString(length) {
    if(isNaN(length)) {
        length = 30;
    }
    var text = "";
    var string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += string.charAt(Math.floor(Math.random() * string.length));

    return text;
}

function encryptPassword(password) {
    if (!password || !salt)
        return '';

    return bcrypt.hashSync(password, salt)
}

function handleError(res, err) {
    return res.status(500).json(err);
}