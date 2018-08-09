'use strict';
var _ = require('lodash');
var db = require('../../dbconnection.js');
var unquies = require('../../config/environment/unique.js');

exports.details = function(req, res) {
	// DB Connect
	var id = req.param('id');

	var query = 'SELECT * FROM lastnames WHERE id = ' + id;

	db.query(query  ,function(err,rows){
		if(err) {
			return handleError(res, err);
		}
		return res.status(200).json({'result': rows[0]['lastname']});
	});
};

exports.request = function(req, res) {
	var lastname = req.param('lastname');
	var customer_email = req.param('customer_email');
	var customer_firstname = req.param('customer_firstname');
	var customer_lastname = req.param('customer_lastname');
};

exports.list = function(req, res) {

	var letter = req.param('letter');
	var limit = req.param('limit');
	var offset = req.param('offset');
	var result = [];

	var query = 'SELECT * FROM lastnames WHERE lastname = "' + letter + '" LIMIT ' +offset + ',' + limit;

	db.query(query  ,function(err,rows){
		if(err) {
			return handleError(res, err);
		}

		for (var index = 0; index <rows.length; index++){
			var myJson = {'id':rows[index]['id'], 'lastname':rows[index]['lastname']};
			result.push(myJson);
		}
		if (result.length>0)
			return res.status(200).json({'result': result});
		else
			return res.status(201).send({'result': []});
	});
};

function handleError(res, err) {
	return res.status(500).send(err);
}