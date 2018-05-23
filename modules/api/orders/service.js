class OrdersService {
  constructor(req) {
    this.req = req;
  }

  fetchOrders() {
    const { Order } = this.req.models;
    return Order.find();
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

  validatePerson(person) {
    if (!person.givenNames) {
      return { status: 400, error: 'You must provide given names.', code: 'missingGivenNames' };
    }

    if (!person.sureName) {
      return { status: 400, error: 'You must provide sure name.', code: 'missingSureName' };
    }

    if (!person.dob) {
      return { status: 400, error: 'You must provide Date of Birth.', code: 'missingDob' };
    }

    if (!person.pob) {
      return { status: 400, error: 'You must provide Place of Birth.', code: 'missingPob' };
    }

    if (!person.gender) {
      return { status: 400, error: 'You must provide Gender.', code: 'missingGender' };
    }

    if (!person.motherName) {
      return { status: 400, error: 'You must provide mother name', code: 'missingMotherName' };
    }

    if (!person.fatherName) {
      return { status: 400, error: 'You must provide father name', code: 'missingFatherName' };
    }

    if (!person.passportNumber) {
      return {
        status: 400,
        error: 'You must provide passport number',
        code: 'missingPassportNumber'
      };
    }

    if (!person.passportIssueDate) {
      return {
        status: 400,
        error: 'You must provide passport issue date',
        code: 'missingPassportIssueDate'
      };
    }

    if (!person.passportExpiryDate) {
      return {
        status: 400,
        error: 'You must provide passport expiry date',
        code: 'missingPassportExpiryDate'
      };
    }

    if (!person.passportPhoto) {
      return {
        status: 400,
        error: 'You must provide passport photo',
        code: 'missingPassportPhoto'
      };
    }

    if (!person.email) {
      return { status: 400, error: 'You must provide email', code: 'missingEmail' };
    }

    if (!person.phoneNumber) {
      return { status: 400, error: 'You must provide phone number', code: 'missingPhoneNumber' };
    }

    if (!person.photo) {
      return { status: 400, error: 'You must provide a photo', code: 'missingPhoto' };
    }

    return true;
  }
}

module.exports = OrdersService;
