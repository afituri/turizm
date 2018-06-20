const express = require('express');
const controller = require('./controller');

module.exports = () => {
  const router = express.Router();

  router
    .route('/')
    .get(controller.feedBackIndex)
    .post(controller.feedBackCreate);

  router.route('/:id').get(controller.feedBackShow);

  return router;
};
