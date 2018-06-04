const EmailService = require('./email');
const { evisa } = require('../config');
const messages = require('../messages');

const _newSendGridEmail = (
  fromEmail,
  fromName,
  toEmail,
  subject,
  templateId,
  url,
  name,
  refNum
) => {
  return {
    to: toEmail,
    from: {
      email: fromEmail,
      name: fromName
    },
    subject,
    templateId,
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      name: name,
      refNum: refNum,
      subject: subject,
      url: url
    }
  };
};

class EmailVerificationService {
  sendOrderActivationCode(order) {
    const { email, givenNames, sureName } = order.people[0];
    const { locale, refNum } = order;
    const name = `${givenNames} ${sureName}`;
    const subject = messages.orderActivation[`subject-${locale}`];
    const templateId = messages.orderActivation[`templateId-${locale}`];
    const url = `${evisa.apiUrl}/api/v1/orders/${order._id}/activate?ref-num=${refNum}`;
    const emailOptions = _newSendGridEmail(
      evisa.email,
      'Evisa Turizm',
      email,
      subject,
      templateId,
      url,
      name,
      refNum
    );
    return EmailService.send(emailOptions);
  }
}

module.exports = new EmailVerificationService();
