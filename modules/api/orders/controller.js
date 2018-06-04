const Service = require('./service');
const shortid = require('shortid');
const mongoose = require('mongoose');
const { evisa } = require('../../../config');

const EmailService = require('../../../services/emailVerification');

class OrdersAPIController {
  ordersIndex(req, res) {
    const service = new Service(req);
    return service
      .fetchOrders()
      .then(orders => {
        return res.json({ orders: orders });
      })
      .catch(e => {
        console.log('\nError on at ordersIndex - GET /orders', e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  ordersShow(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    service
      .fetchOrderById(id)
      .then(order => {
        return res.json({ order });
      })
      .catch(e => {
        console.log(`\nError at GET /orders/${id}`, e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  ordersCreate(req, res) {
    const service = new Service(req);
    const {
      applicationType,
      country,
      travelDocument,
      arrivalDate,
      people,
      familyStatement,
      bankStatement,
      workCertificate,
      hotelReservations,
      ownershipCertificate,
      locale
    } = req.body;

    if (!applicationType || !country || !travelDocument || !arrivalDate) {
      return res
        .status(400)
        .json({ error: 'Some information are missing', code: 'missingInformation' });
    }

    if (!people.length) {
      return res
        .status(400)
        .json({ error: 'You must provide at least one person', code: 'missingPerson' });
    }

    const validatePeople = service.validatePeople(people);

    if (validatePeople.error) {
      return res
        .status(validatePeople.status)
        .json({ error: validatePeople.error, code: validatePeople.code });
    }

    const validateAlgerian = service.validateAlgerian(applicationType, country, people[0].dob);

    if (validateAlgerian.error) {
      return res
        .status(validateAlgerian.status)
        .json({ error: validateAlgerian.error, code: validateAlgerian.code });
    }

    const peopleLst = people.map(person => {
      return Object.assign({}, person, {
        refNum: shortid.generate()
      });
    });

    return service
      .createOrder({
        applicationType,
        country,
        travelDocument,
        people: peopleLst,
        familyStatement,
        bankStatement,
        workCertificate,
        hotelReservations,
        ownershipCertificate,
        locale,
        refNum: shortid.generate()
      })
      .then(order => {
        EmailService.sendOrderActivationCode(order);
        order = order.toObject();
        delete order.refNum;
        return res.status(201).send({ order });
      })
      .catch(e => {
        console.log('\nError at POST /orders', e);
        return res.status(400).json({ error: e, code: 'unknownError' });
      });
  }

  async ordersActivate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const refNum = req.query['ref-num'];
    let order;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.redirect(`${evisa.feUrl}/errors/invalidId`);
    }

    if (!refNum) {
      return res.redirect(`${evisa.feUrl}/errors/wrongRefNum`);
    }

    try {
      order = await service.fetchOrderById(id);
      if (order.refNum !== refNum) {
        return res.redirect(`${evisa.feUrl}/errors/wrongRefNum`);
      }
      order = await service.findByIdAndUpdate(id, { status: 'active' });
      return res.redirect(`${evisa.feUrl}/orders/${id}`);
    } catch (e) {
      return res.redirect(`${evisa.feUrl}/errors/unknownError`);
    }
  }

  ordersUpdate(req, res) {
    const service = new Service(req);
    const { id } = req.params;
    const updateOrder = service.findByIdAndUpdate(id, req.body);

    updateOrder.then(order => res.status(200).json({ order })).catch(e => {
      console.log(`Error at PUT /orders/${id}`, e);
      res.status(400).json({ error: e, code: 'unknownError' });
    });
  }

  ordersDelete(req, res) {
    const service = new Service(req);
    const { id } = req.params;

    const deleteOrder = service.deleteOrderById(id);

    deleteOrder.then(() => res.status(200).json({ id })).catch(e => {
      console.log(`Error at Delete /orders/${id}`, e);
      return res.status(400).json({ error: e, code: 'unknownError' });
    });
  }
}

module.exports = new OrdersAPIController();
