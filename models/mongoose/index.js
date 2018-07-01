const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Order = require('./order').Order;
const Person = require('./person').Person;
const Feedback = require('./feedback').Feedback;

mongoose.Promise = bluebird;

module.exports = {
  Feedback,
  Order,
  Person
};
