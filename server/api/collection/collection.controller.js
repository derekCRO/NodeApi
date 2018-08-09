'use strict';
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var AWS = require('aws-sdk');
var db = require('../../dbconnection.js');
var config = require('../../config/environment');
var helper = require('../../library/helper.js');
var uniques = require('../../config/environment/unique.js');
var decoded = null;

exports.listCollections = function(req, res) {
  if (isAuthenticated(req)) {
    var limit = req.param('limit');
    var offset = req.param('offset');
    var result = [];
    var id = decoded._id;

    var query = 'SELECT V.image as v_img, V.color, V.color_code, S.css_class, S.name, S.slug as surface_slug, S.slug, P.id as product_id, P.image, P.preview_thumb, P.mask_enabled, L.lastname, SL.filename FROM saved_logos as SL INNER JOIN variants as V on V.id = SL.variant_id INNER JOIN products as P on V.product_id = P.id INNER JOIN surfaces as S on S.type = P.type INNER JOIN templates T on T.id = SL.template_id INNER JOIN lastnames L on L.id = T.lastname_id WHERE SL.user_id = ' + id + ' LIMIT ' +offset + ',' + limit;

    db.query(query  ,function(err,rows){
      if(err) {
        return handleError(res, err);
      }

      for (var index = 0; index <rows.length; index++){
        var myJson = {
          'product_id':rows[index]['product_id'],
          'variant_img':rows[index]['v_img'],
          'color_code':rows[index]['color_code'],
          'css_class':rows[index]['css_class'],
          'name':rows[index]['name'],
          'surface_slug':rows[index]['surface_slug'],
          'filename':helper.saved_logo_url(rows[index]['filename']),
          'preview_thumb':helper.get_image_url(rows[index]['preview_thumb'], 'PRODUCT_THUMB'),
          'mask_enabled':rows[index]['mask_enabled'],
          'lastname':rows[index]['lastname']
        };
        result.push(myJson);
      }
      return res.status(200).json({'result': result});
    });
  } else {
    return handleError(res, 'unauthorized');
  }
};

exports.addToCollections = function(req, res) {
  if (isAuthenticated(req)) {
    var image = req.param('image');
    AWS.config.update({ accessKeyId: uniques.amazon.amazon_api_key, secretAccessKey: uniques.amazon.amazon_api_secret, region: uniques.amazon.region });

    var base64data = new Buffer(image, 'binary');
    var filename = makeString(10) + '.png';
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    s3.putObject({
      Bucket: uniques.amazon.logo_bucket,
      Key: uniques.amazon.saved_logos_folder + '/' + filename,
      Body: base64data,
      ACL: 'public-read'
    },function (res) {
      console.log(res);
      console.log('Successfully uploaded package.');
    });

    var d = new Date();
    var create_ts = 
      d.getFullYear() + "-" + 
      ("00" + (d.getMonth() + 1)).slice(-2) + "-" + 
      ("00" + d.getDate()).slice(-2) + " " + 
      ("00" + d.getHours()).slice(-2) + ":" + 
      ("00" + d.getMinutes()).slice(-2) + ":" + 
      ("00" + d.getSeconds()).slice(-2);

    var data = {
      user_id: decoded._id,
      params: req.param('params'),
      template_id:  req.param('template_id'),
      lastname_id: req.param('lastname_id'),
      variant_id : req.param('variant_id'),
      filename: filename,
      create_ts: create_ts
    };

    var query = 'SELECT * FROM templates as t WHERE t.id = ' + req.param('template_id');
    db.query(query, function(err,rows){
      if(err) {
        return handleError(res, err);
      }
      if (rows[0] != undefined) {
        data.folder_id = rows[0]['folder_id'];
        query = "INSERT INTO saved_logos (user_id, params, template_id, lastname_id, variant_id, filename, create_ts, folder_id) VALUES(" + data.user_id + ", '" + data.params + "', '" + data.template_id + "', '" + data.lastname_id + "', '" + data.variant_id  + "', '" + data.filename  + "', '" + data.create_ts + "', '" + data.folder_id + "')";
        db.query(query, function (err, result) {
          if(err) {
            return handleError(res, err);
          }
          else {
            return res.json({ success: true });
          }
        });
      }
      else {
        return res.json({ success: false });
      }
    });
  } else {
    return handleError(res, 'unauthorized');
  }
};

exports.removeFromCollections = function(req, res) {
  
};

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

var isAuthenticated = function(req) {
  if (req.headers && req.headers.token) {
    var token = req.headers.token;
    try {
      decoded = jwt.verify(token, config.secrets.session);
    } catch (e) {
      return false;
    }
    return true;
  }
  return false;
};

exports.isAuthenticated = isAuthenticated;

function handleError(res, err) {
  return res.status(500).json(err);
}
