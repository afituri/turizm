const express = require('express');
const request = require('request');

const { secretKey } = require('../config').google;

module.exports = () => {
  const router = express.Router();

  router.route('/').post(async (req, res) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      json: true,
      uri: 'https://www.google.com/recaptcha/api/siteverify',
      form: {
        secret: secretKey,
        response: req.body.captchaResponse,
        remoteip: req.connection.remoteAddress
      }
    };
    try {
      const response = await request(options);
      return res.send({ response });
    } catch (error) {
      return res.send({ error });
    }
  });

  return router;
};
