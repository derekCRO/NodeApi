'use strict';
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var db = require('../../dbconnection.js');
var config = require('../../config/environment');

exports.list = function(req, res) {
  if (isAuthenticated(req)) {
    var limit = req.param('limit');
    var offset = req.param('offset');
    var query = 'SELECT * FROM `orders` as O WHERE O.user_id =' + req.user.id + ' LIMIT ' + offset + ',' + limit;
    db.query(query, function(err,rows){
      if (err){
        return handleError(res, err);
      }
      if (rows!= undefined && rows.length>0) {
        var result = [];
        for (var index = 0; index<rows.length; index++ ) {
          var itemsJSON = {
            'id':rows[index]['id'],
            'status':handleStatus(rows[index]['status']),
            'create_ts':rows[index]['create_ts']
          };
          result.push(itemsJSON);
        }
        return res.status(200).json({'result': result});
      }
      else
        return res.status(201).send({'result': []});
    });
  } else {
    return handleError(res, 'unauthorized');
  }
};

exports.detail = function(req, res) {
  if (isAuthenticated(req)) {
    var order_id = req.param('id');
    var query = "SELECT * FROM `orders` as O WHERE O.user_id =" + req.user.id + " AND O.id =" + order_id;
    db.query(query, function(err,rows){
      if (err){
        return handleError(res, err);
      }
      if (rows!= undefined && rows.length>0) {
        var items = [];
        var query2 = "SELECT * FROM `cart_items` as CI WHERE CI.cart_id =" + rows[0]['cart_id'];
        db.query(query2, function(err,rows2){
          if (err) {
            return handleError(res, err);
          }
          if(rows2!= undefined && rows2.length>0) {
            for (var index = 0; index<rows2.length; index++ ) {
              var itemsJSON = {
                'logo_for_preview': uniques.path.web + '/media/print_previews/'+rows2[index]['custom_print'],
                'logo_for_print':rows2[index]['logo_url'],
                'params':JSON.parse(rows2[index]['params']),
                'price':rows2[index]['price']
              };
              items.push(itemsJSON);
            }
            var result = {
              'id':rows[0]['id'],
              'customer': {
                'name':rows[0]['name'],
                'email':rows[0]['email'],
                'phone':rows[0]['phone']
              },
              'address':{
                'address':rows[0]['address'],
                'address2':rows[0]['address2'],
                'city':rows[0]['city'],
                'state':rows[0]['state'],
                'zip':rows[0]['zip'],
                'country':rows[0]['country']
              },
              'status':handleStatus(rows[0]['status']),
              'total_amount':rows[0]['total'],
              'shipping':rows[0]['shipping'],
              'items':items,
              'create_ts':rows[0]['create_ts']
            };
            return res.status(200).json({'result': result});
          }
          else {
            return res.status(201).send({'result': []});
          }
        });
      }
      else
        return res.status(201).send({'result': []});
    });
  } else {
    return handleError(res, 'unauthorized');
  }
};

exports.addItem = function(req, res) {
  if (isAuthenticated(req)) {
    return res.status(201).send({'result': []});
  } else {
    return handleError(res, 'unauthorized');
  }
};

exports.removeItem = function(req, res) {
  if (isAuthenticated(req)) {
    return res.status(201).send({'result': []});
  } else {
    return handleError(res, 'unauthorized');
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}

function handleStatus(res) {
  switch(res) {
    case 1:
      return 'ORDER_STATUS_UNPAID'
      break;
    case 2:
      return 'ORDER_STATUS_PAID'
      break;
    case 3:
      return 'ORDER_STATUS_SHIPPED'
      break;
    case 4:
      return 'ORDER_STATUS_REFUNDED'
      break;
    default:
      return ''
  } 
}

var isAuthenticated = function(req) {
  if (req.headers && req.headers.token) {
    var token = req.headers.token,
      decoded;
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
