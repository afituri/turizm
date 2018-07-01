const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router
    .route('/')
    .get(controller.feedbackIndex)
    .post(controller.feedbackCreate);

  return router;
};
