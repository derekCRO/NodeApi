'use strict';

// Development specific configuration
// ==================================
module.exports = {
  port: 3000,

  allowed_origins: [
    'http://localhost:3000'
  ],
  mysql: {
    host: 'localhost',
    user:'root',
    password:'',
    database:"namedrop"
  },
  hostname: 'http://localhost:3000'
};
