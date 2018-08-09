"use strict";
var uniques = require('../config/environment/unique.js');
var date = require('date-util');
var fs = require('fs')
var crypto = require("crypto");

exports.get_signed_cloudfront_url = function(url) {

  var expires = new Date().strtotime("+1 hour");
  expires = expires.getTime() /1000;
  expires = Math.round(expires);

  var signature = get_canned_policy_stream_name(
    url,
    uniques.amazon.cloudfront_keypair_file,
    uniques.amazon.cloudfront_keypair_id,
    expires
    );

  return url + '?'+signature;
};

function get_canned_policy_stream_name(image_path, private_key_filename, key_pair_id, expires){

  var canned_policy = '{"Statement":[{"Resource":"' + image_path + '","Condition":{"DateLessThan":{"AWS:EpochTime":'+ expires + '}}}]}';
  console.log(canned_policy);
  var encoded_policy = url_safe_base64_encode(canned_policy);
  var signature =  rsa_sha1_sign(canned_policy, private_key_filename);
  var encoded_signature = url_safe_base64_encode(signature);
  var stream_name = 'Expires=' + expires;
  var stream_name = stream_name + '&Signature=' + encoded_signature + '&Key-Pair-Id=' + key_pair_id;
  return stream_name;
}

function url_safe_base64_encode(value){
  var encoded = new Buffer(value).toString('base64');
  // replace unsafe characters +, = and / with 
  // the safe characters -, _ and ~
  var find= new Array ('+', '=', '/');
  var replace= new Array ('-','_','~'); 
  return encoded.replaceArray(find,replace);
}

function rsa_sha1_sign(policy, private_key_filename){
    var signature = "";
    // load the private key
  
    var priv_key = fs.readFileSync(private_key_filename,"utf8");
    var signature = crypto.createSign('sha1').update(policy).sign(priv_key);       
    return signature;
}

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  for (var l = 0; l < replaceString.length; l ++){
    for (var i = 0; i < find.length; i++) {
      replaceString = replaceString.replace(find[i], replace[i]);
    }
  }
  return replaceString;
};
