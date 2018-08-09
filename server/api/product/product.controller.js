'use strict';
var _ = require('lodash');
var Promise = require('promise');
var db = require('../../dbconnection.js');
var helper = require('../../library/helper.js');

exports.getFeatured = function(req, res) {
  var category_id = req.param('category_id');
  var surface_id = req.param('surface_id');
  var product_id = req.param('product_id');
  var query = '';
  if(product_id) {
    query = 'SELECT *, PT.* FROM products as P INNER JOIN product_thumbs as PT on PT.product_id = P.id INNER JOIN surfaces as S on S.printful_type = P.type WHERE P.is_available = 1 AND P.enabled = 1 AND P.id = ' + product_id ;
  }
  else {
    if(surface_id) {
      query = 'SELECT *, PT.* FROM products as P INNER JOIN product_thumbs as PT on PT.product_id = P.id INNER JOIN surfaces as S on S.printful_type = P.type WHERE P.is_available = 1 AND P.featured = 1 AND P.enabled = 1 AND S.id = ' + surface_id;
    }
    else {
      query = 'SELECT *, PT.* FROM products as P INNER JOIN product_thumbs as PT on PT.product_id = P.id INNER JOIN surfaces as S on S.printful_type = P.type WHERE P.is_available = 1 AND P.featured = 1 AND P.enabled = 1 AND S.default_surface = 1';
    }
  }

  db.query(query, function(err,rows) {
    if(err) {
      return handleError(res, err);
    }
    if (rows!= undefined && rows.length > 0 ) {
      var thumb_images = [];
      for (var index = 0; index<rows.length ; index ++ ) {
        var category_ids = rows[index]['categories'].split(",");
        if(category_ids.indexOf(category_id)) {
          thumb_images.push(rows[index]);
        }
      }
      if(thumb_images.length > 0) {
        var thumb_image = thumb_images[Math.floor(Math.random()*thumb_images.length)];
        var path = '';
        if(thumb_image['listing_thumb'])
          path = helper.get_icon(thumb_image['listing_thumb'], 'PRODUCT_THUMB');
        else
          path = helper.get_icon('default.jpg', 'PRODUCT_THUMB');

        var query2 = "SELECT *, V.image, V.id FROM variants as V INNER JOIN products as P on P.id = V.product_id WHERE P.is_available = 1 AND V.active = 1 AND P.id =" + thumb_image['product_id'] + " GROUP BY V.color";
        db.query(query2, function(err,rows2) {
          var variants = [];
          if (err){
            return handleError(res, err);
          }
          else if (rows2 !=undefined && rows2.length>0) {
            for (var index = 0; index<rows2.length; index ++ ) {
              var resultJson = {
                'id': rows2[index]['id'],
                'name': rows2[index]['name'],
                'size': rows2[index]['size'],
                'color': rows2[index]['color'],
                'color_code': rows2[index]['color_code'],
                'price': rows2[index]['price'],
                'image': rows2[index]['image'],
              };
              variants.push(resultJson);
            }
          }
          var result = {
            id: thumb_image['product_id'],
            image: path,
            type: thumb_image['type'],
            brand: thumb_image['brand'],
            model: thumb_image['model'],
            description: thumb_image['description'],
            mask_enabled: thumb_image['mask_enabled'],
            variants: variants
          }
          return res.status(200).json({'result': result});
        });
      }
      else {
        return res.status(200).json({'result': {}});
      }
    }
    else
      return res.status(201).send({'result': {}});
  });
};

exports.getAllBySurface = function(req, res) {
  var surface_id = req.param('surface_id');
  var limit = req.param('limit');
  var offset = req.param('offset');
  var counter = 0;
  var query = 'SELECT *, PT.* FROM products as P INNER JOIN product_thumbs as PT on PT.product_id = P.id INNER JOIN surfaces as S on S.printful_type = P.type WHERE P.is_available = 1 AND P.enabled = 1 AND S.id = ' + surface_id + ' GROUP BY P.id' + ' LIMIT ' +offset + ',' + limit;

  db.query(query, function(err,rows) {
    if(err) {
      return handleError(res, err);
    }
    if (rows!= undefined && rows.length > 0 ) {
      var result = [];
      for (var i = 0; i<rows.length; i++ ) {
        var query2 = "SELECT *, V.image, V.id FROM variants as V INNER JOIN products as P on P.id = V.product_id WHERE V.active = 1 AND P.id =" + rows[i]['product_id'] + " GROUP BY V.color";
        db.query(query2, function(err,rows2) {
          var variants = [];
          var thumb_image = rows[counter];
          var path = '';
          if(thumb_image['listing_thumb'])
            path = helper.get_icon(thumb_image['listing_thumb'], 'PRODUCT_THUMB');
          else
            path = helper.get_icon('default.jpg', 'PRODUCT_THUMB');
          if (err){
            return handleError(res, err);
          }
          else if (rows2 !=undefined && rows2.length>0) {
            for (var index = 0; index<rows2.length; index ++ ) {
              var resultJson = {
                'id': rows2[index]['id'],
                'name': rows2[index]['name'],
                'size': rows2[index]['size'],
                'color': rows2[index]['color'],
                'color_code': rows2[index]['color_code'],
                'price': rows2[index]['price'],
                'image': rows2[index]['image'],
              };
              variants.push(resultJson);
            }
          }
          var prd = {
            id: thumb_image['product_id'],
            image: path,
            type: thumb_image['type'],
            brand: thumb_image['brand'],
            model: thumb_image['model'],
            description: thumb_image['description'],
            mask_enabled: thumb_image['mask_enabled'],
            variants: variants
          }
          result.push(prd);
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
    else
      return res.status(201).send({'result': []});
  });
};

exports.getDetail = function(req, res) {
  var product_id = req.param('product_id');
  var query = 'SELECT *, PT.* FROM products as P INNER JOIN product_thumbs as PT on PT.product_id = P.id INNER JOIN surfaces as S on S.printful_type = P.type WHERE P.is_available = 1 AND P.enabled = 1 AND P.id = ' + product_id;

  db.query(query, function(err,rows) {
    if(err) {
      return handleError(res, err);
    }
    if (rows!= undefined && rows.length > 0 ) {
       for (var i = 0; i<rows.length; i++ ) {
        var query2 = "SELECT *, V.image, V.id FROM variants as V INNER JOIN products as P on P.id = V.product_id WHERE V.active = 1 AND P.id =" + rows[i]['product_id'] + " ORDER BY V.size";
        db.query(query2, function(err,rows2) {
          var variants = [];
          var thumb_image = rows[0];
          var path = '';
          if(thumb_image['listing_thumb'])
            path = helper.get_icon(thumb_image['listing_thumb'], 'PRODUCT_THUMB');
          else
            path = helper.get_icon('default.jpg', 'PRODUCT_THUMB');
          if (err){
            return handleError(res, err);
          }
          else if (rows2 !=undefined && rows2.length>0) {
            for (var index = 0; index<rows2.length; index ++ ) {
              var resultJson = {
                'id': rows2[index]['id'],
                'name': rows2[index]['name'],
                'size': rows2[index]['size'],
                'color': rows2[index]['color'],
                'color_code': rows2[index]['color_code'],
                'price': rows2[index]['price'],
                'image': rows2[index]['image'],
              };
              variants.push(resultJson);
            }
          }
          var result = {
            id: thumb_image['product_id'],
            image: path,
            type: thumb_image['type'],
            brand: thumb_image['brand'],
            model: thumb_image['model'],
            description: thumb_image['description'],
            mask_enabled: thumb_image['mask_enabled'],
            variants: variants
          }
          return res.status(200).json({'result': result});
        });
      }
    }
    else
      return res.status(201).send({'result': []});
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
