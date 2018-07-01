const Service = require('./service');
const EmailService = require('../../../services/emailFeedback');

class FeedbackAPIController {
  feedbackIndex(req, res) {
    const service = new Service(req);
    return service
      .fetchFeedback()
      .then(feedback => {
        return res.json({ feedback });
      })
      .catch(e => {
        console.log('\nError on at feedbackIndex - GET /feedback', e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  async feedbackCreate(req, res) {
    const service = new Service(req);
    const {
      feedBackType,
      country,
      givenNames,
      sureName,
      email,
      feedBack,
      locale,
      travelDocNo
    } = req.body;

    if ((!feedBackType || !country || !givenNames || !sureName, !feedBack, !locale, !email)) {
      return res
        .status(400)
        .json({ error: 'Some information are missing', code: 'missingInformation' });
    }

    try {
      let feedback = await service.createFeedback({
        feedBackType,
        country,
        givenNames,
        sureName,
        locale,
        email,
        feedBack,
        travelDocNo
      });
      await EmailService.sendFeedback(feedback);

      return res.status(201).send({ feedback });
    } catch (e) {
      console.log('\nError at POST /feedback', e);

      return res.status(400).json({ error: e, code: 'unknownError' });
    }
  }
}

module.exports = new FeedbackAPIController();
