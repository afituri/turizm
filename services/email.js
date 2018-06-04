const { sendgrid } = require('../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgrid.apiKey);

class EmailService {
  send(options) {
    return new Promise((resolve, reject) => {
      sgMail.send(options, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  }
}

module.exports = new EmailService();
