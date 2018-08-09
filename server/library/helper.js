"use strict";
var Promise = require('promise');
var fs = require('fs');
var google = require('googleapis');
var async = require('async');
var uniques = require('../config/environment/unique.js');
var cloudfront = require('./cloudfront.js');
var gdrive = require('./gdrive.js');

exports.get_image_url = function (template, size, storage) {

  var path = '';
  var filename = (size == 'lo-res' ? template['low_res_b'] : template['hi_res_b']);
  var size_dir = size;

  if (storage == 's3'){
    path = 'http://';
    path += uniques.amazon.s3_domain!=""? uniques.amazon.s3_domain  + '/':'' + uniques.amazon.logo_bucket;
    path += '/' + template['dir'] + '/' + size_dir + '/' + filename;
  }
  else if (storage == 'cloudfront'){
    path = 'http://' + uniques.amazon.cloudfront_domain + '/' + template['dir'] + '/' + size_dir + '/' + filename
    path = cloudfront.get_signed_cloudfront_url(path);
  }

  return path;
}

exports.get_gdrive_url = function (template, size, storage) {

  var promise = new Promise(function(resolve, reject) {
    var path = '';
    var filename = (size == 'lo-res' ? template['low_res_b'] : template['hi_res_b']);
    var size_dir = size;

    if (storage == 'google'){
      var dir = template['dir'] + '/' + size_dir;
      var dirs = dir.split("/");
      var parent = 'root';
      var service = google.drive('v3');
      var folder = '';

      async.whilst(
        function () {
          if(folder = dirs.shift()) {
            return true;
          }
        },
        function (callback) {
          service.files.list({
            auth: gdrive.getO2AuthClient(),
            pageSize: 10,
            q: "trashed != true and name='" + folder + "' and '" + parent + "' in parents and mimeType = 'application/vnd.google-apps.folder'"
          }, function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              callback(null, null);
            }
            var files = response.files;
            if (files.length > 0) {
              parent = files[0].id;
            }
            callback(null, parent);
          });
        },
        function (err, parent) {
          service.files.list({
            auth: gdrive.getO2AuthClient(),
            fields: "files(id, name)",
            q: "trashed != true and name='" + filename + "' and '" + parent + "' in parents and mimeType = 'image/png'",
          }, function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              reject(false);
            }
            var files = response.files;
            if (files.length == 0) {
              console.log('No File');
              reject(false);
            } else {
              var file_id = files[0].id;
              if(file_id) {
                path = "https://drive.google.com/uc?export=download&id=" + file_id;
              }
              else {
                path = '';
              }
              resolve(path);
            }
          });
        }
      );
    }
    else {
      reject(false);
    }
  });
  return promise;
}

exports.get_icon = function(icon, type) {
  if(icon) {
    var path = '';
    switch(type) {
      case 'CATEGORY':
        path = uniques.path.web + uniques.path.category + icon;
        break;
      case 'SURFACE':
        path = uniques.path.web + uniques.path.surface + icon;
        break;
      case 'PRODUCT_THUMB':
        path = uniques.path.web + uniques.path.product_thumb + icon;
        break;
      default:
        return ''
    }
    return path;
  }
  return null;
}

exports.saved_logo_url = function (logo) {

  var path = 'https://s3.amazonaws.com/';
    path += uniques.amazon.s3_domain!=""? uniques.amazon.s3_domain  + '/':'' + uniques.amazon.logo_bucket;
    path += '/saved_logos/' + logo;

  return path;
}

exports.get_video = function(template, storage)
{
    if(!template)
      return FALSE;

    var path ='', filename = 'video.mp4';

    if(storage == 's3')
    {
      path = 'http://';
      path += (uniques.amazon.s3_domain ? (uniques.amazon.s3_domain + '/'):'') + uniques.amazon.logo_bucket;
      path += '/video/' + template['dir'] + '/' + filename;
    }

    return path;
}
