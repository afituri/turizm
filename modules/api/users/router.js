const express = require('express');
const controller = require('./controller');
const { isUser } = require('../../../middleware/auth');

module.exports = () => {
  const router = express.Router();

  router.route('/').post(controller.usersCreate);

  router.route('/login').post(controller.loginUser);

  router.route('/me').get(isUser, controller.me);

  router
    .route('/:id')
    .get(isUser, controller.usersShow)
    .put(controller.usersUpdate);

  return router;
};
