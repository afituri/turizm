const Service = require('./service');
const EmailService = require('../../../services/emailVerification');

class FeedbackAPIController {
  feedbacksIndex(req, res) {
    const service = new Service(req);
    return service
      .fetchFeedback()
      .then(feedback => {
        return res.json({ feedback: feedback });
      })
      .catch(e => {
        console.log('\nError on at feedbackIndex - GET /feedback', e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  async feedbackCreate(req, res) {
    const service = new Service(req);
    const {
      feedbackType, country, givenNames, sureName, email, feedback, locale
    } = req.body;

    if ((!feedbackType || !country || !givenNames || !sureName, !feedback, !locale, !email)) {
      return res
        .status(400)
        .json({ error: 'Some information are missing', code: 'missingInformation' });
    }

    try {
      let feedbackObj = await service.createFeedback({
        feedbackType,
        country,
        givenNames,
        sureName,
        locale,
        email,
        feedback
      });
      await EmailService.sendFeedback(feedbackObj);

      return res.status(201).send({ feedbackObj });
    } catch (e) {
      console.log('\nError at POST /feedbacks', e);

      return res.status(400).json({ error: e, code: 'unknownError' });
    }
  }
}

module.exports = new FeedbackAPIController();
