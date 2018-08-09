'use strict';
var _ = require('lodash');
var db = require('../../dbconnection.js');
var unquies = require('../../config/environment/unique.js');

exports.details = function(req, res) {
	// DB Connect
	var code = req.query.code;

	// Use a prepared statement to prevent SQL injection attacks.
	var query = 'SELECT * FROM coupons WHERE code = ?';

	db.query(query, code, function(err,rows){
		if(err) {
			return handleError(res, err);
		}

		if (_.isEmpty(rows)) {
				return res.status(404).send('Not found');
		}

		return res.status(200).json({'result': rows[0]});
	});
};

function handleError(res, err) {
	return res.status(500).send(err);
}
