const moment = require('moment');

class OrdersService {
  constructor(req) {
    this.req = req;
  }

  fetchOrders(q) {
    const { Order } = this.req.models;
    let {
      page, pageSize, sorted, filtered
    } = q;
    let query = {};
    let sort = {};
    if (filtered) {
      query = filtered.reduce((obj, item) => {
        obj[item.id] = item.value;
        return obj;
      }, {});
    }

    if (sorted) {
      sort[sorted[0].id] = sorted[0].desc === 'true' ? -1 : 1;
    }

    const options = {
      page: parseInt(page, 10) + 1,
      limit: parseInt(pageSize, 10),
      sort
    };

    return Order.paginate(query, options);
  }

  fetchOrderById(id) {
    const { Order } = this.req.models;
    return Order.findById(id);
  }

  fetchOrderByQuery(query) {
    const { Order } = this.req.models;
    return Order.findOne(query);
  }

  createOrder(data) {
    const { Order } = this.req.models;
    return Order.create(data);
  }

  findByIdAndUpdate(id, body) {
    const { Order } = this.req.models;
    return Order.findByIdAndUpdate(id, body, { new: true });
  }

  updateServiceStatus(requestId, action) {
    const { Order } = this.req.models;
    let status = action === 'accept' ? 'accepted' : 'rejected';

    return Order.update(
      { 'requests._id': requestId.toString() },
      { $set: { 'requests.$.status': status } },
      { new: true }
    );
  }

  deleteOrderById(id) {
    const { Order } = this.req.models;
    return Order.remove({ _id: id });
  }

  validateAlgerian(applicationType, country, dob) {
    const age = moment().diff(dob, 'years', false);
    if (applicationType === 'person' && country === 'algeria' && (age < 18 || age > 35)) {
      return {
        status: 400,
        error: 'We are sorry but we can not proceed with this application.',
        code: 'invalidAlgerian'
      };
    }
    return true;
  }

  validatePeople(people) {
    let valid = {};
    people.forEach(person => {
      if (!person.givenNames) {
        valid = { status: 400, error: 'You must provide given names.', code: 'missingGivenNames' };
      }

      if (!person.sureName) {
        valid = { status: 400, error: 'You must provide sure name.', code: 'missingSureName' };
      }

      if (!person.dob) {
        valid = { status: 400, error: 'You must provide Date of Birth.', code: 'missingDob' };
      }

      if (!person.pob) {
        valid = { status: 400, error: 'You must provide Place of Birth.', code: 'missingPob' };
      }

      if (!person.gender) {
        valid = { status: 400, error: 'You must provide Gender.', code: 'missingGender' };
      }

      if (!person.motherName) {
        valid = { status: 400, error: 'You must provide mother name', code: 'missingMotherName' };
      }

      if (!person.fatherName) {
        valid = { status: 400, error: 'You must provide father name', code: 'missingFatherName' };
      }

      if (!person.passportNumber) {
        valid = {
          status: 400,
          error: 'You must provide passport number',
          code: 'missingPassportNumber'
        };
      }

      if (!person.passportIssueDate) {
        valid = {
          status: 400,
          error: 'You must provide passport issue date',
          code: 'missingPassportIssueDate'
        };
      }

      if (!person.passportExpiryDate) {
        valid = {
          status: 400,
          error: 'You must provide passport expiry date',
          code: 'missingPassportExpiryDate'
        };
      }

      if (!person.passportPhoto) {
        valid = {
          status: 400,
          error: 'You must provide passport photo',
          code: 'missingPassportPhoto'
        };
      }

      if (!person.email) {
        valid = { status: 400, error: 'You must provide email', code: 'missingEmail' };
      }

      if (!person.phoneNumber) {
        valid = { status: 400, error: 'You must provide phone number', code: 'missingPhoneNumber' };
      }

      if (!person.photo) {
        valid = { status: 400, error: 'You must provide a photo', code: 'missingPhoto' };
      }
    });

    if (valid) {
      return valid;
    }
    return true;
  }
}

module.exports = OrdersService;
