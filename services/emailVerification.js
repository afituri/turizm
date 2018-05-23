const EmailService = require('./email');
const { evisa } = require('../config');
const messages = require('../messages');
const format = require('string-template');

const createEmailOptions = (userData, type) => {
  const {
    email, name, refNum, locale
  } = userData;
  let html;
  switch (type) {
    case 'orderCreation':
      html = format(messages.orderActivation[`html-${locale}`], {
        name,
        refNum
      });
      return {
        from: `Evisa Turizm <${evisa.email}>`,
        to: email,
        subject: messages.orderActivation[`subject-${locale}`],
        html
      };
    case 'passwordReset':
      html = format(messages.passwordReset[`html-${userData.locale}`], {
        url: evisa.apiUrl,
        hash: userData.verificationHash
      });
      return {
        from: `Evisa Turizm <${evisa.email}>`,
        to: userData.email,
        subject: messages.passwordReset[`subject-${userData.locale}`],
        html
      };
    default:
      return {};
  }
};

class EmailVerificationService {
  sendOrderActivationCode(order, emailType) {
    let { email, givenNames, sureName } = order.people[0];
    let { locale, refNum } = order;
    let emailOptions = createEmailOptions(
      {
        locale,
        email,
        name: `${givenNames} ${sureName}`,
        refNum
      },
      emailType
    );
    return EmailService.send(emailOptions);
  }
}

module.exports = new EmailVerificationService();
