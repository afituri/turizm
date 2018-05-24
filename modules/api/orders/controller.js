const Service = require('./service');
const shortid = require('shortid');
const mongoose = require('mongoose');

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
      travelDoc,
      arrivalDate,
      people,
      familyStatement,
      locale
    } = req.body;

    if (!applicationType || !country || !travelDoc || !arrivalDate) {
      return res
        .status(400)
        .json({ error: 'Some information are missing', code: 'missingInformation' });
    }

    if (!people.length) {
      return res
        .status(400)
        .json({ error: 'You must provide at least one person', code: 'missingPerson' });
    }

    if (applicationType === 'family' && !familyStatement) {
      return res
        .status(400)
        .json({ error: 'You must provide a family statement', code: 'missingFamilyStatement' });
    }

    const validatePerson = service.validatePerson(people[0]);

    if (validatePerson.error) {
      return res
        .status(validatePerson.status)
        .json({ error: validatePerson.error, code: validatePerson.code });
    }

    return service
      .createOrder({
        applicationType,
        country,
        travelDoc,
        people,
        familyStatement,
        locale,
        refNum: shortid.generate()
      })
      .then(order => {
        EmailService.sendOrderActivationCode(order, 'orderCreation');
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
    const { refNum } = req.body;
    let order;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', code: 'invalidId' });
    }

    if (!refNum) {
      return res.status(400).json({ error: 'Missing reference number', code: 'missingRefNum' });
    }

    try {
      order = await service.fetchOrderById(id);
      if (order.refNum !== refNum) {
        return res.status(400).json({ error: 'Wrong reference number', code: 'wrongRefNum' });
      }
      order = await service.findByIdAndUpdate(id, { status: 'active' });
      return res.status(200).json({ order });
    } catch (e) {
      return res.status(400).json({ error: e, code: 'unknownError' });
    }
  }

  async addPerson(req, res) {
    const service = new Service(req);
    const { Person } = req.models;
    const { id } = req.params;
    const { person } = req.body;
    let order;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID', code: 'invalidId' });
    }

    if (!person) {
      return res
        .status(400)
        .json({ error: 'You must provide at least one person', code: 'missingPerson' });
    }

    const validatePerson = service.validatePerson(person);

    if (validatePerson.error) {
      return res
        .status(validatePerson.status)
        .json({ error: validatePerson.error, code: validatePerson.code });
    }

    try {
      order = await service.fetchOrderById(id);

      if (order.status !== 'active') {
        return res
          .status(400)
          .json({ error: 'This application has not been activated yet.', code: 'notActive' });
      }

      if (!order.familyStatement) {
        return res
          .status(400)
          .json({ error: 'You must provide a family statement', code: 'missingFamilyStatement' });
      }
      let personObj = new Person(person);
      await personObj.save();
      order.people.push(personObj);
      await order.save();
      return res.status(201).json({ order });
    } catch (e) {
      return res.status(400).json({ error: e, code: 'unknownError' });
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
