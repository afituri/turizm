const Service = require('./service');
const EmailService = require('../../../services/emailVerification');

class FeedBackAPIController {
  ordersIndex(req, res) {
    const service = new Service(req);
    return service
      .fetchFeedBack()
      .then(feedBack => {
        return res.json({ feedBack: feedBack });
      })
      .catch(e => {
        console.log('\nError on at feedBackIndex - GET /feedBack', e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  async feedBackCreate(req, res) {
    const service = new Service(req);
    const {
      feedBackType, country, givenNames, sureName, email, feedBack, locale
    } = req.body;

    if ((!feedBackType || !country || !givenNames || !sureName, !feedBack, !locale, !email)) {
      return res
        .status(400)
        .json({ error: 'Some information are missing', code: 'missingInformation' });
    }

    try {
      let feedBackObj = await service.createFeedBack({
        feedBackType,
        country,
        givenNames,
        sureName,
        locale,
        email,
        feedBack
      });
      await EmailService.sendOrderActivationCode(order);

      return res.status(201).send({ order });
    } catch (e) {
      console.log('\nError at POST /orders', e);

      return res.status(400).json({ error: e, code: 'unknownError' });
    }
  }
}

module.exports = new FeedBackAPIController();
