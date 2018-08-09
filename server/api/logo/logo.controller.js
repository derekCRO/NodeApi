'use strict';
var _ = require('lodash');
var Promise = require('promise');
var urlExists = require('url-exists');
var db = require('../../dbconnection.js');
var helper = require('../../library/helper.js');

exports.getLogoFullsize = function(req, res) {
  var id = req.param('id');
  var query = 'SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id WHERE t.id = ' + id ;
  db.query(query, function(err,rows){
    if(err) {
      return handleError(res, err);
    }
    if (rows[0] != undefined) {
      var result = [];
      var promise = helper.get_gdrive_url(rows[0], 'hi-res', 'google', res);
      promise.then(function(path) {
        return res.status(200).send({url: path});
      },
      function(err) {
        return res.status(200).send({error: 'file not found'});
      });
    }
    else {
      return res.status(201).send("Invalid Id, Please try with exact id"); 
    }
  });
};

exports.getLogoCategories = function(req, res) {

  var limit = req.param('limit');
  var offset = req.param('offset');
  var query = 'SELECT * FROM categories WHERE parent_id = 0 AND shop_id = ' + req.user.shop_id + ' LIMIT ' + offset + ',' + limit;
  var result = [];
  var counter = 0;

  db.query(query, function(err,rows) {
    if(err) {
      return handleError(res, err);
    }
    if(rows!= undefined && rows.length > 0) {
      for (var index = 0; index < rows.length; index++) {
        var query2 = "SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id WHERE c.cat_id =" + rows[index]['id'];
        db.query(query2, function(err,rows2){
          if (err){
            return handleError(res, err);
          }
          if(rows2!= undefined) {
            var resultJson = {'id':rows[counter]['id'], 'name':rows[counter]['name'], 'image':helper.get_icon(rows[counter]['icon'], 'CATEGORY'), 'priority':1, 'count':rows2.length};
            result.push(resultJson);
          }
          if(counter >= rows.length -1) {
            res.contentType('application/json');
            if (result.length >0)
              return res.status(200).json({'result': result});
            else
              return res.status(201).send({'result': []});
          }
          counter ++;
        });
      }
    }
  });
};

exports.getLogoSubCategories = function(req, res) {

  var limit = req.param('limit');
  var offset = req.param('offset');
  var parent_id = req.param('parent_id');
  var query = 'SELECT * FROM categories WHERE parent_id = ' + parent_id + ' AND shop_id = ' + req.user.shop_id + ' LIMIT ' + offset + ',' + limit;
  var result = [];
  var counter = 0;

  db.query(query, function(err,rows) {
    if(err) {
      return handleError(res, err);
    }
    if(rows!= undefined && rows.length > 0) {
      for (var index = 0; index < rows.length; index++) {
        var query2 = "SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id WHERE c.cat_id =" + rows[index]['id'];
        db.query(query2, function(err,rows2){
          if (err){
            return handleError(res, err);
          }
          if(rows2!= undefined) {
            var resultJson = {'id':rows[counter]['id'], 'name':rows[counter]['name'], 'image':helper.get_icon(rows[counter]['icon'], 'CATEGORY'), 'priority':1, 'count':rows2.length};
            result.push(resultJson);
          }
          if(counter >= rows.length -1) {
            res.contentType('application/json');
            if (result.length >0)
              return res.status(200).json({'result': result});
            else
              return res.status(201).send({'result': []});
          }
          counter ++;
        });
      }
    }
  });
};

exports.getLogosByLastname = function(req, res) {

  var lastname = req.param('lastname');
  var limit = req.param('limit');
  var offset = req.param('offset');
  var query = "SELECT *, cat_id FROM lastnames as l INNER JOIN templates as t on t.lastname_id = l.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id WHERE l.lastname = '" + lastname + "' LIMIT " + offset + "," + limit;
  var result = [];
  var ids = [];

  db.query(query, function(err,rows){
    if(err) {
      return handleError(res, err);
    }
    if(rows!= undefined && rows.length > 0){
      for (var index = 0; index <rows.length; index++) {
        ids.push(rows[index]["id"]);
      }
      var query = 'SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id WHERE t.id IN (' + ids + ')';
      db.query(query, function(err,rows2){
        if (err){
          return handleError(res, err);
        }
        else if (rows2 !=undefined && rows2.length>0) {
          for (var index = 0; index<rows2.length; index ++ )
          {
            var path = helper.get_image_url(rows2[index], 'lo-res', 's3');
            var resultJson = {'id':rows2[index]['id'], 'url':path, 'category_id':rows[index]['cat_id']};
            result.push(resultJson);
          }
          res.contentType('application/json');
          if (result.length >0)
            return res.status(200).json({'result': result});
          else
            return res.status(201).send({'result': []});
        }
        else{
            return res.status(201).send("No Data for this Lastname."); 
        }
      });
    }
    else
    {
      return res.status(500).send("Invalid Lastname, Please try with exact Lastname"); 
    }
  });   
};

exports.getLogosByCategory = function(req, res) {
  var id = req.param('id');
  var limit = req.param('limit');
  var result = [];
  var query = "SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id WHERE c.cat_id =" + id +  " LIMIT " + limit;
  db.query(query, function(err,rows){
    if(rows != undefined && rows.length >0) {
      for (var index = 0; index<rows.length ; index ++ ) {
        var path = helper.get_image_url(rows[index], 'lo-res', 's3');
        var resultJson = {'id':rows[index]['id'], 'url':path};
        result.push(resultJson);
      }
      res.contentType('application/json');
      if(result.length>0)
        return res.status(200).json({'result': result});
      else
        return res.status(201).send({'result': []});
    }
    else{
      return res.status(201).send({'result': []});
    }
  });
};

exports.getLogosByLastnameCategory = function(req, res) {
  var id = req.param('id');
  var lastname = req.param('lastname');
  var result = [];
  var query = "SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id INNER JOIN lastnames as l on t.lastname_id = l.id WHERE c.cat_id =" + id +  " AND l.lastname ='" + lastname + "'";
  db.query(query, function(err,rows){
    if(rows != undefined && rows.length >0) {
      for (var index = 0; index<rows.length ; index ++ ) {
        var path = helper.get_image_url(rows[index], 'lo-res', 's3');
        var resultJson = {'id':rows[index]['id'], 'url':path};
        result.push(resultJson);
      }
      res.contentType('application/json');
      if(result.length>0)
        return res.status(200).json({'result': result});
      else
        return res.status(201).send({'result': []});
    }
    else{
      return res.status(201).send({'result': []});
    }
  });
};

exports.getPopular = function(req, res) {
  var id = req.param('id');
  var limit = req.param('limit');
  var result = [];
  var query = "SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id ORDER BY num_views DESC LIMIT " + limit;
  db.query(query, function(err,rows){
    if (rows != undefined && rows.length >0) {
      for (var index = 0; index<rows.length ; index ++ ) {
        var path = helper.get_image_url(rows[index], 'lo-res', 's3');
        var resultJson = {'id':rows[index]['id'], 'url':path, 'category_id':rows[index]['cat_id']};
        result.push(resultJson);
      }
      res.contentType('application/json');
      if (result.length>0)
        return res.status(200).json({'result': result});
      else
        return res.status(201).send({'result': []});
    }
    else{
      return res.status(201).send({'result': []});
    }
  });
};

exports.getLogoPreview = function(req, res) {

  var id = req.param('id');
  var last = req.param('lastname');
  var result = [];
  var query = "SELECT * FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN lastnames as l on t.lastname_id = l.id WHERE t.id =" + id +  " AND l.lastname ='" + last  +"'";

  db.query(query, function(err,rows){
    if(err) {
      return handleError(res, err);
    }
    res.contentType('application/json');
    if (rows!= undefined && rows.length > 0 ){
      var path = helper.get_image_url(rows[0], 'lo-res', 's3');
      return res.status(200).json({'result': {url: path}});
    }
    else
      return res.status(201).send({'result': []});
  });
};

exports.getPreviewVideo = function(req, res) {

  var id = req.param('id');
  var last = req.param('lastname');
  var result = [];
  var query = "SELECT * FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN lastnames as l on t.lastname_id = l.id WHERE t.id =" + id +  " AND l.lastname ='" + last  +"'";

  db.query(query, function(err,rows){
    if(err) {
      return handleError(res, err);
    }
    res.contentType('application/json');
    if (rows!= undefined && rows.length > 0 ){
      var path = helper.get_video(rows[0], 's3');
      urlExists(path, function(err, exists) {
        if(exists) {
          return res.status(200).json({'result': {url: path}});
        }
        else {
          return res.status(200).send({'result': {url:''}});
        }
      });
    }
    else
      return res.status(201).send({'result': []});
  });
};

exports.search = function(req, res) {
  var id = req.param('id');
  var keyword = req.param('keyword');
  var limit = req.param('limit');
  var offset = req.param('offset');
  var result = [];
  var query = "SELECT *, t.id FROM templates as t INNER JOIN logo_folders as f on t.folder_id = f.id INNER JOIN folder_cats as c on c.folder_id = t.folder_id WHERE f.name LIKE '%" + keyword +  "%' OR f.dir LIKE '%" + keyword +  "%' OR f.tags LIKE '%" + keyword + "%' LIMIT " + offset + "," + limit;

  db.query(query, function(err,rows) {
    if(err) {
      return handleError(res, err);
    }
    if(rows != undefined && rows.length >0) {
      for (var index = 0; index<rows.length ; index ++ ) {
        var path = helper.get_image_url(rows[index], 'lo-res', 's3');
        var resultJson = {'id':rows[index]['id'], 'url':path};
        result.push(resultJson);
      }
      res.contentType('application/json');
      if(result.length>0)
        return res.status(200).json({'result': result});
      else
        return res.status(201).send({'result': []});
    }
    else{
      return res.status(201).send({'result': []});
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
