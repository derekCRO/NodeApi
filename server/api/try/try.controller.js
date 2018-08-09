'use strict';

var _ = require('lodash');
var db = require('../../dbconnection.js');
var helper = require('../../library/helper.js');

exports.getLogo = function(req, res) {

	var phrase = req.param('phrase');
	var limit = 8;
	var result = [];
	var ids = [];
	var query = '';

	if(phrase)
		query = "SELECT t.id FROM templates as t INNER JOIN lastnames as l on l.id = t.lastname_id WHERE l.lastname LIKE '" + phrase +  "%' LIMIT " + limit;
	else
		query = "SELECT t.id FROM templates as t INNER JOIN lastnames as l on l.id = t.lastname_id LIMIT " + limit;

	db.query(query, function(err,rows){
		if(err) {
			return handleError(res, err);
		}
		if(rows!= undefined && rows.length > 0) {
			for (var index = 0; index <rows.length; index++) {
				ids.push(rows[index]["id"]);
			}

			query = 'SELECT * FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id WHERE t.id IN (' + ids + ')';

			db.query(query, function(err,rows2){
				if (err){

				}
				else if (rows2 !=undefined && rows2.length>0){
					for (index = 0; index < rows2.length; index ++) {
						var path =  helper.get_image_url(rows2[index],'lo-res', 's3');
						var resultJson = {'id':rows2[index]['id'], 'url':path};
						result.push(resultJson);
					}
					res.contentType('application/json');
					if (result.length >0)
						return res.status(200).json({'result': result});
					else
						return res.status(201).send({'result': []});
				}
				else {
					return res.status(201).send("No Data for this Phrase."); 
				}
			}); 
		}
		else
		{
			return res.status(500).send("Invalid Phrase"); 
		}
	});
};


exports.getLastname = function(req, res) {

	var phrase = req.param('phrase');
	var limit = 8;
	var result = [];

	var query = 'SELECT * FROM lastnames WHERE lastname LIKE "' + phrase + '%" LIMIT ' + limit;

	db.query(query, function(err,rows){
		if(err) {
			return handleError(res, err);
		}

		for (var index = 0; index <rows.length; index++){
			var myJson = {'id':rows[index]['id'], 'lastname':rows[index]['lastname']};
			result.push(myJson);
		}
		if (result.length > 0)
			return res.status(200).json({'result': result});
		else
			return res.status(201).send({'result': []});
	});
};

function handleError(res, err) {
  return res.status(500).send(err);
}