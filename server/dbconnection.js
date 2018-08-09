var mysql = require('mysql');
var config = require('./config/environment');
var con = mysql.createConnection({
  host: config.mysql.host,//"localhost",
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});
con.connect(function(err){
  if(err){
      console.log('Error connecting to Db');
    }
    console.log('Connection established');
});

exports = module.exports = con;
