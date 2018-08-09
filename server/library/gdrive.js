"use strict";
var fs = require('fs');
var googleAuth = require('google-auth-library');

const TOKEN_PATH = './../application/libraries/google/credentials/ournameshop.token.json';
const SECRET_PATH = './../application/libraries/google/credentials/ournameshop.json';

exports.getO2AuthClient = function() {
  try {
    var content = fs.readFileSync(SECRET_PATH);
    var credentials = JSON.parse(content);
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  } catch (err) {
    console.log('Error loading client secret file: ' + err);
    return false;
  }

  try {
    var token = fs.readFileSync(TOKEN_PATH);
    oauth2Client.credentials = JSON.parse(token);
    return oauth2Client;
  } catch (err) {
    console.log('Error loading token file: ' + err);
    return false;
  }
}
