'use strict';
var _ = require('lodash');
var db = require('../../dbconnection.js');

exports.shipping = function (req, res) {
  var cartId = req.params.cartId;
  var coupon = req.body.coupon;
  var discount = 0;
  var subtotal = 0;
  var shippingPrice = 0;
  var order = [];

  var orderQuery = "SELECT * FROM orders WHERE cart_id = ?";

  db.query(orderQuery, cartId, function (err, rows) {
      if (!err) {
        order = rows[0];
      }

      var query = "SELECT * FROM `cart_items` as CI WHERE CI.cart_id = ?";

      db.query(query, cartId, function (err, rows) {
        if (err) {
          return handleError(res, err);
        }

        if (_.isEmpty(rows)) {
          return res.status(404).send('Not found');
        }
      });

      var subtotalQuery = "SELECT SUM(q * price) as subtotal FROM cart_items WHERE cart_id = ?";

      db.query(subtotalQuery, cartId, function (err, rows) {
        if (err) {
            return handleError(res, err);
        }

        subtotal = rows[0]['subtotal'];

        var data = {
          name: req.body.name,
          email: req.body.email,
          subtotal:  subtotal,
          shipping_custom: 0,
          shipping_id_custom: 0
        };

        calculateDiscount(subtotal, coupon)
          .then(discount => {
              data.discount = discount;
              data.total = subtotal - discount;
              if (order) {
                var query = db.query("UPDATE orders SET ? WHERE id = ?", [data, order['id']]);
                data.id = order['id'];

                return res.status(200).json({'result': data});
              } else {
                data.cart_id = cartId;
                db.query("INSERT INTO orders VALUES ?", data, function (err, result) {
                  data.id = result.insertId;
                });

                return res.status(201).json({'result': data});
              }
          })
          .catch(error => {
            return handleError(res, error);
          });
      });
  });
};

function calculateDiscount(subtotal, couponCode) {
  return new Promise( (resolve, reject) => {
    var discount = 0;
    var couponQuery = "SELECT * FROM coupons WHERE code = ? AND amount >= 1 AND status = 'available' AND (NOW() BETWEEN startDate AND expiryDate)"

    if (_.isEmpty(couponCode)) {
      return resolve(0);
    }

    db.query(couponQuery, couponCode, function (err, rows) {
      if (err) {
        return reject(err);
      }

      if (!err) {
        var coupon = rows[0];
        switch (coupon['type']) {
            case 'percentage':
                discount = subtotal * coupon['value'] / 100;
                break;

            case 'amount':
                discount = coupon['value'];
                break;

            default:
                $discount = 0;
                break;
        }

        var updateQuery = "UPDATE coupons SET ? WHERE id = ?";
        var amount = coupon['amount'] - 1;
        var updates = [
          {
            amount: amount,
            status: (amount) ? 'available' : 'used'
          },
          coupon['id']
        ];

        db.query(updateQuery, updates);

        return resolve(((subtotal - discount) > 0) ? discount : subtotal);
      }
    });
  });
}

function handleError(res, err) {
	return res.status(500).send(err);
}
