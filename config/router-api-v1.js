const express = require('express');
const users = require('../modules/api/users/router')();
const orders = require('../modules/api/orders/router')();
const images = require('../modules/api/images/router')();
const feedback = require('../modules/api/feedback/router')();

module.exports = () => {
  const router = express.Router();

  router.use('/feedback', feedback);
  router.use('/images', images);
  router.use('/users', users);
  router.use('/orders', orders);

  return router;
};
