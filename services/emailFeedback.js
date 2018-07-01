const EmailService = require('./email');
const messages = require('../messages');

class EmailFeedbackService {
  sendFeedback(feedback) {
    const {
      feedBackType,
      country,
      email,
      givenNames,
      sureName,
      locale,
      travelDocNo,
      feedBack
    } = feedback;
    const name = `${givenNames} ${sureName}`;
    const subject = messages.feedBack.subject[feedBackType][locale];
    const templateId = messages.feedBack[`templateId-${locale}`];

    return EmailService.send({
      to: messages.feedBack.country[country],
      from: {
        email,
        name
      },
      subject,
      templateId,
      substitutionWrappers: ['{{', '}}'],
      substitutions: {
        subject,
        feedBackType,
        givenNames,
        sureName,
        email,
        travelDocNo,
        feedBack
      }
    });
  }
}

module.exports = new EmailFeedbackService();
