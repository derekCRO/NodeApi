'use strict';
var _ = require('lodash');
var Promise = require('promise');
var db = require('../../dbconnection.js');
var helper = require('../../library/helper.js');

exports.getSurfaceParent = function(req, res) {
  var query = 'SELECT * FROM surfaces WHERE parent_id = 0 AND active = 1';
  db.query(query, function(err,rows){
    if(err) {
      return handleError(res, err);
    }
    res.contentType('application/json');
    if (rows!= undefined && rows.length > 0 ){
      var result = [];
      for (var index = 0; index<rows.length ; index ++ ) {
        var path = helper.get_icon(rows[index]['icon'], 'SURFACE');
        var resultJson = {
          'id':rows[index]['id'],
          'name':rows[index]['type'],
          'type':rows[index]['name'],
          'icon':path,
          'category_id':rows[index]['cat_id'],
          'default_product':rows[index]['default_product'],
          'has_children':rows[index]['has_children'],
        };
        result.push(resultJson);
      }
      res.contentType('application/json');
      if (result.length>0)
        return res.status(200).json({'result': result});
      else
        return res.status(201).send({'result': []});
    }
    else
      return res.status(201).send({'result': []});
  });
};

exports.getSurfaceChild = function(req, res) {
  var parent_id = req.param('parent_id');
  var query = 'SELECT * FROM surfaces WHERE parent_id = ' + parent_id + ' AND active = 1';
  db.query(query, function(err,rows){
    if(err) {
      return handleError(res, err);
    }
    res.contentType('application/json');
    if (rows!= undefined && rows.length > 0 ){
      var result = [];
      for (var index = 0; index<rows.length ; index ++ ) {
        var path = helper.get_icon(rows[index]['icon'], 'SURFACE');
        var resultJson = {
          'id':rows[index]['id'],
          'name':rows[index]['type'],
          'type':rows[index]['name'],
          'icon':path,
          'category_id':rows[index]['cat_id'],
          'default_product':rows[index]['default_product'],
        };
        result.push(resultJson);
      }
      res.contentType('application/json');
      if (result.length>0)
        return res.status(200).json({'result': result});
      else
        return res.status(201).send({'result': []});
    }
    else
      return res.status(201).send({'result': []});
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
