const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Order = require('./order').Order;

mongoose.Promise = bluebird;

module.exports = {
  Order
};
