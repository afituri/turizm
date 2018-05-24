const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Order = require('./order').Order;
const Person = require('./person').Person;

mongoose.Promise = bluebird;

module.exports = {
  Order,
  Person
};
