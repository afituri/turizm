const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Order = require('./order').Order;
const Person = require('./person').Person;
const Feedback = require('./feedback').Feedback;
const User = require('./user').User;

mongoose.Promise = bluebird;

module.exports = {
  Feedback,
  Order,
  Person,
  User
};
