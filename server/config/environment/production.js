'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  '127.0.0.1',

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  3000,

  mysql: {
    host: 'localhost',
    user:'lastname_root',
    password:'OcbP90LUB',
    database:"lastname_main"
  }

  //hostname: 'https://developers.ournameshop.com/'
};
