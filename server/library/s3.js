"use strict";
var uniques = require('../config/environment/unique.js');

exports.get_s3_url = function(url) {
	var expires = new Date().strtotime("+1 hour");  
	var signature = get_canned_policy_stream_name(
		url,
		uniques.amazon.cloudfront_keypair_file,
		uniques.amazon.cloudfront_keypair_id,
		expires
		);
	return url;
};
