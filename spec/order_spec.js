/* eslint-disable */
// Disable all application logging while running tests

//console.log = function() {};

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const moment = require('moment');
const helpers = require('./helpers/objectCreators');

const { Order } = mongoose;

describe('Order', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1';
  let server;
  let req;
  let order;
  let body;
  let token;

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  beforeEach(done => {
    order = new Order(helpers.order);
    order
      .save()
      .then(() => {
        done();
      });
  });

  it('gets all orders', done => {
    request.get(
      {
        url: `${apiUrl}/orders`
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.orders[0]._id).toBe(order._id.toString());
        expect(body.orders[0].applicationType).toBe('person');
        expect(body.orders[0].country).toBe('libya');
        expect(body.orders[0].travelDoc).toBe('ordinary');
        expect(body.orders[0].people[0].givenNames).toBe('Salem Ahmed');
        expect(body.orders[0].people[0].sureName).toBe('Mohammed');
        expect(moment(body.orders[0].people[0].dob).year()).toBe(1986);
        expect(body.orders[0].people[0].pob).toBe('Buckarest');
        expect(body.orders[0].people[0].gender).toBe('male');
        expect(body.orders[0].people[0].motherName).toBe('Farah');
        expect(body.orders[0].people[0].passportNumber).toBe('L34UFKEU');
        expect(body.orders[0].people[0].fatherName).toBe('Mokhtar');
        expect(moment(body.orders[0].people[0].passportIssueDate).year()).toBe(2014);
        expect(moment(body.orders[0].people[0].passportExpiryDate).year()).toBe(2018);
        expect(body.orders[0].people[0].passportPhoto).toBe('/somephoto');
        expect(body.orders[0].people[0].email).toBe('myemail@email.com');
        expect(body.orders[0].people[0].phoneNumber).toBe('00903883838833');
        expect(body.orders[0].people[0].address).toBe('Some Address');
        expect(body.orders[0].people[0].photo).toBe('/somephoto');
        done();
      }
    );
  });

  it('creates a new person order', done => {
    request.post(
      {
        url: `${apiUrl}/orders`,
        form: {
          applicationType: 'person',
          country: 'libya',
          travelDoc: 'ordinary',
          arrivalDate: new Date(),
          people: [{
            givenNames: 'Ahmed Ali',
            sureName: 'Salem',
            dob: moment({ years: 1985, months: 3, days: 5 }).toJSON(),
            pob: 'Buckarest',
            gender: 'male',
            motherName: 'Sara',
            fatherName: 'Omran',
            passportNumber: 'L34UFKES',
            passportIssueDate: moment({ years: 2013, months: 3, days: 5 }).toJSON(),
            passportExpiryDate: moment({ years: 2017, months: 3, days: 5 }).toJSON(),
            passportPhoto: '/somephoto2',
            email: 'myemail2@email.com',
            phoneNumber: '00903883838834',
            address: 'Some Address2',
            photo: '/somephoto2'
          }]
        }
      },
      (err, res, body) => {
        console.log(body);
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.order.applicationType).toBe('person');
        expect(body.order.country).toBe('libya');
        expect(body.order.travelDoc).toBe('ordinary');
        expect(body.order.people[0].givenNames).toBe('Ahmed Ali');
        expect(body.order.people[0].sureName).toBe('Salem');
        expect(moment(body.order.people[0].dob).year()).toBe(1985);
        expect(body.order.people[0].pob).toBe('Buckarest');
        expect(body.order.people[0].gender).toBe('male');
        expect(body.order.people[0].motherName).toBe('Sara');
        expect(body.order.people[0].fatherName).toBe('Omran');
        expect(body.order.people[0].passportNumber).toBe('L34UFKES');
        expect(moment(body.order.people[0].passportIssueDate).year()).toBe(2013);
        expect(moment(body.order.people[0].passportExpiryDate).year()).toBe(2017);
        expect(body.order.people[0].passportPhoto).toBe('/somephoto2');
        expect(body.order.people[0].email).toBe('myemail2@email.com');
        expect(body.order.people[0].phoneNumber).toBe('00903883838834');
        expect(body.order.people[0].address).toBe('Some Address2');
        expect(body.order.people[0].photo).toBe('/somephoto2');
        done();
      }
    );
  });
});



// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2, logIn, createToken } = helpers;
