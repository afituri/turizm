const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router
    .route('/')
    .get(controller.ordersIndex)
    .post(controller.ordersCreate);

  router.route('/:id/activate').get(controller.ordersActivate);

  router.route('/:id/resend').get(controller.resendActivation);

  router.route('/:id').get(controller.ordersShow);

  return router;
};
