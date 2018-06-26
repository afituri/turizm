/* eslint-disable */
// Disable all application logging while running tests

console.log = function() {};

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
    order.save().then(() => {
      done();
    });
  });

  it('gets all orders', done => {
    request.get(
      {
        url: `${apiUrl}/orders`,
        qs: {
          page: 0,
          pageSize: 10,
          sorted: [],
          filtered: [
            [
              {
                id: 'status',
                value: 'open'
              },
              {
                id: 'country',
                value: 'libya'
              }
            ]
          ]
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.orders.docs[0]._id).toBe(order._id.toString());
        expect(body.orders.docs[0].applicationType).toBe('person');
        expect(body.orders.docs[0].country).toBe('libya');
        expect(body.orders.docs[0].travelDocument).toBe('ordinary');
        expect(body.orders.docs[0].bankStatement).toBe('/someBankStatement');
        expect(body.orders.docs[0].workCertificate).toBe('/someWorkCertificate');
        expect(body.orders.docs[0].hotelReservations).toBe('/someHotelReservations');
        expect(body.orders.docs[0].ownershipCertificate).toBe('/someOwnershipCertificate');
        expect(body.orders.docs[0].people[0].givenNames).toBe('Salem Ahmed');
        expect(body.orders.docs[0].people[0].sureName).toBe('Mohammed');
        expect(moment(body.orders.docs[0].people[0].dob).year()).toBe(1986);
        expect(body.orders.docs[0].people[0].pob).toBe('Buckarest');
        expect(body.orders.docs[0].people[0].gender).toBe('male');
        expect(body.orders.docs[0].people[0].motherName).toBe('Farah');
        expect(body.orders.docs[0].people[0].passportNumber).toBe('L34UFKEU');
        expect(body.orders.docs[0].people[0].fatherName).toBe('Mokhtar');
        expect(moment(body.orders.docs[0].people[0].passportIssueDate).year()).toBe(2014);
        expect(moment(body.orders.docs[0].people[0].passportExpiryDate).year()).toBe(2018);
        expect(body.orders.docs[0].people[0].passportPhoto).toBe('/somephoto');
        expect(body.orders.docs[0].people[0].email).toBe('myemail@email.com');
        expect(body.orders.docs[0].people[0].phoneNumber).toBe('00903883838833');
        expect(body.orders.docs[0].people[0].address).toBe('Some Address');
        expect(body.orders.docs[0].people[0].photo).toBe('/somephoto');
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
          travelDocument: 'ordinary',
          arrivalDate: new Date(),
          bankStatement: '/someBankStatement',
          workCertificate: '/someWorkCertificate',
          hotelReservations: '/someHotelReservations',
          ownershipCertificate: '/someOwnershipCertificate',
          locale: 'en',
          people: [
            {
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
              email: 'ahmed.fituri@gmail.com',
              phoneNumber: '00903883838834',
              address: 'Some Address2',
              photo: '/somephoto2'
            }
          ]
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.order.applicationType).toBe('person');
        expect(body.order.country).toBe('libya');
        expect(body.order.travelDocument).toBe('ordinary');
        expect(body.order.bankStatement).toBe('/someBankStatement');
        expect(body.order.workCertificate).toBe('/someWorkCertificate');
        expect(body.order.hotelReservations).toBe('/someHotelReservations');
        expect(body.order.ownershipCertificate).toBe('/someOwnershipCertificate');
        expect(body.order.locale).toBe('en');
        expect(body.order.refNum).toBeUndefined();
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
        expect(body.order.people[0].email).toBe('ahmed.fituri@gmail.com');
        expect(body.order.people[0].phoneNumber).toBe('00903883838834');
        expect(body.order.people[0].address).toBe('Some Address2');
        expect(body.order.people[0].photo).toBe('/somephoto2');
        done();
      }
    );
  });

  it('creates a family order', done => {
    request.post(
      {
        url: `${apiUrl}/orders`,
        form: {
          applicationType: 'family',
          country: 'algeria',
          travelDocument: 'ordinary',
          familyStatement: '/somefamilydoc',
          arrivalDate: new Date(),
          bankStatement: '/someBankStatement',
          workCertificate: '/someWorkCertificate',
          hotelReservations: '/someHotelReservations',
          ownershipCertificate: '/someOwnershipCertificate',
          locale: 'ar',
          people: [
            {
              givenNames: 'Ahmed Ali',
              sureName: 'Salem',
              dob: moment({ years: 1985, months: 3, days: 5 }).toJSON(),
              pob: 'Buckarest',
              gender: 'male',
              motherName: 'Sara',
              fatherName: 'Omran',
              familyMember: 'father',
              familyStatement: '/somefamilystatement1',
              passportNumber: 'L34UFKES',
              passportIssueDate: moment({ years: 2013, months: 3, days: 5 }).toJSON(),
              passportExpiryDate: moment({ years: 2017, months: 3, days: 5 }).toJSON(),
              passportPhoto: '/somephoto2',
              email: 'ahmed.fituri@gmail.com',
              phoneNumber: '00903883838834',
              address: 'Some Address2',
              photo: '/somephoto2'
            },
            {
              givenNames: 'Zohra Othman',
              sureName: 'Akram',
              dob: moment({ years: 1990, months: 3, days: 5 }).toJSON(),
              pob: 'Tahran',
              gender: 'female',
              motherName: 'Salma',
              fatherName: 'Mokhtar',
              familyMember: 'mother',
              familyStatement: '/somefamilystatement2',
              passportNumber: 'L34UFKEX',
              passportIssueDate: moment({ years: 2013, months: 3, days: 5 }).toJSON(),
              passportExpiryDate: moment({ years: 2017, months: 3, days: 5 }).toJSON(),
              passportPhoto: '/somephoto3',
              email: 'ahmed.fituri@gmail.com',
              phoneNumber: '00903883838835',
              address: 'Some Address2',
              photo: '/somephoto3'
            }
          ]
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.order.applicationType).toBe('family');
        expect(body.order.country).toBe('algeria');
        expect(body.order.travelDocument).toBe('ordinary');
        expect(body.order.locale).toBe('ar');
        expect(body.order.bankStatement).toBe('/someBankStatement');
        expect(body.order.workCertificate).toBe('/someWorkCertificate');
        expect(body.order.hotelReservations).toBe('/someHotelReservations');
        expect(body.order.ownershipCertificate).toBe('/someOwnershipCertificate');
        expect(body.order.people[0].givenNames).toBe('Ahmed Ali');
        expect(body.order.people[0].sureName).toBe('Salem');
        expect(moment(body.order.people[0].dob).year()).toBe(1985);
        expect(body.order.people[0].pob).toBe('Buckarest');
        expect(body.order.people[0].gender).toBe('male');
        expect(body.order.people[0].motherName).toBe('Sara');
        expect(body.order.people[0].fatherName).toBe('Omran');
        expect(body.order.people[0].familyMember).toBe('father');
        expect(body.order.people[0].familyStatement).toBe('/somefamilystatement1');
        expect(body.order.people[0].passportNumber).toBe('L34UFKES');
        expect(moment(body.order.people[0].passportIssueDate).year()).toBe(2013);
        expect(moment(body.order.people[0].passportExpiryDate).year()).toBe(2017);
        expect(body.order.people[0].passportPhoto).toBe('/somephoto2');
        expect(body.order.people[0].email).toBe('ahmed.fituri@gmail.com');
        expect(body.order.people[0].phoneNumber).toBe('00903883838834');
        expect(body.order.people[0].address).toBe('Some Address2');
        expect(body.order.people[0].photo).toBe('/somephoto2');
        expect(body.order.people[1].givenNames).toBe('Zohra Othman');
        expect(body.order.people[1].sureName).toBe('Akram');
        expect(moment(body.order.people[1].dob).year()).toBe(1990);
        expect(body.order.people[1].pob).toBe('Tahran');
        expect(body.order.people[1].gender).toBe('female');
        expect(body.order.people[1].motherName).toBe('Salma');
        expect(body.order.people[1].fatherName).toBe('Mokhtar');
        expect(body.order.people[1].familyMember).toBe('mother');
        expect(body.order.people[1].familyStatement).toBe('/somefamilystatement2');
        expect(body.order.people[1].passportNumber).toBe('L34UFKEX');
        expect(moment(body.order.people[1].passportIssueDate).year()).toBe(2013);
        expect(moment(body.order.people[1].passportExpiryDate).year()).toBe(2017);
        expect(body.order.people[1].passportPhoto).toBe('/somephoto3');
        expect(body.order.people[1].email).toBe('ahmed.fituri@gmail.com');
        expect(body.order.people[1].phoneNumber).toBe('00903883838835');
        expect(body.order.people[1].address).toBe('Some Address2');
        expect(body.order.people[1].photo).toBe('/somephoto3');
        done();
      }
    );
  });

  it('fails to create a new person order', done => {
    request.post(
      {
        url: `${apiUrl}/orders`,
        form: {
          applicationType: 'person',
          country: 'libya',
          travelDocument: 'ordinary',
          arrivalDate: new Date(),
          locale: 'en',
          people: [
            {
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
              email: 'ahmed.fituri@gmail.com',
              phoneNumber: '00903883838834',
              address: 'Some Address2'
            }
          ]
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.code).toBe('missingPhoto');
        done();
      }
    );
  });

  it('fails to create a an algerian with out of age order', done => {
    request.post(
      {
        url: `${apiUrl}/orders`,
        form: {
          applicationType: 'person',
          country: 'algeria',
          travelDocument: 'ordinary',
          arrivalDate: new Date(),
          locale: 'en',
          people: [
            {
              givenNames: 'Ahmed Ali',
              sureName: 'Salem',
              dob: moment({ years: 1980, months: 3, days: 5 }).toJSON(),
              pob: 'Buckarest',
              gender: 'male',
              motherName: 'Sara',
              fatherName: 'Omran',
              passportNumber: 'L34UFKES',
              passportIssueDate: moment({ years: 2013, months: 3, days: 5 }).toJSON(),
              passportExpiryDate: moment({ years: 2017, months: 3, days: 5 }).toJSON(),
              passportPhoto: '/somephoto2',
              email: 'ahmed.fituri@gmail.com',
              phoneNumber: '00903883838834',
              address: 'Some Address2',
              photo: '/somephoto3'
            }
          ]
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(400);
        expect(body.code).toBe('invalidAlgerian');
        done();
      }
    );
  });

  it('activates an order', done => {
    request.get(
      {
        url: `${apiUrl}/orders/${order._id}/activate`,
        qs: {
          'ref-num': order.refNum
        }
      },
      (err, res, body) => {
        request.get(
          {
            url: `${apiUrl}/orders/${order._id}`
          },
          (err, res, body) => {
            body = JSON.parse(body);
            expect(res.statusCode).toBe(200);
            expect(body.order.status).toBe('active');
            done();
          }
        );
      }
    );
  });

  it('fails to activate usung wrong ref-num', done => {
    request.get(
      {
        url: `${apiUrl}/orders/${order._id}/activate`,
        qs: {
          'ref-num': 'wrongrefnum'
        }
      },
      (err, res, body) => {
        request.get(
          {
            url: `${apiUrl}/orders/${order._id}`
          },
          (err, res, body) => {
            body = JSON.parse(body);
            expect(res.statusCode).toBe(400);
            expect(body.code).toBe('notActive');
            done();
          }
        );
      }
    );
  });

  it('shows a specific order', done => {
    Order.findByIdAndUpdate(order._id, { status: 'active' }, { new: true }).then(order1 => {
      request.get(
        {
          url: `${apiUrl}/orders/${order._id}`
        },
        (err, res, body) => {
          body = JSON.parse(body);
          expect(res.statusCode).toBe(200);
          expect(body.order._id).toBe(order1._id.toString());
          expect(body.order.applicationType).toBe('person');
          expect(body.order.country).toBe('libya');
          expect(body.order.travelDocument).toBe('ordinary');
          expect(body.order.bankStatement).toBe('/someBankStatement');
          expect(body.order.workCertificate).toBe('/someWorkCertificate');
          expect(body.order.hotelReservations).toBe('/someHotelReservations');
          expect(body.order.ownershipCertificate).toBe('/someOwnershipCertificate');
          expect(body.order.people[0].givenNames).toBe('Salem Ahmed');
          expect(body.order.people[0].sureName).toBe('Mohammed');
          expect(moment(body.order.people[0].dob).year()).toBe(1986);
          expect(body.order.people[0].pob).toBe('Buckarest');
          expect(body.order.people[0].gender).toBe('male');
          expect(body.order.people[0].motherName).toBe('Farah');
          expect(body.order.people[0].passportNumber).toBe('L34UFKEU');
          expect(body.order.people[0].fatherName).toBe('Mokhtar');
          expect(moment(body.order.people[0].passportIssueDate).year()).toBe(2014);
          expect(moment(body.order.people[0].passportExpiryDate).year()).toBe(2018);
          expect(body.order.people[0].passportPhoto).toBe('/somephoto');
          expect(body.order.people[0].email).toBe('myemail@email.com');
          expect(body.order.people[0].phoneNumber).toBe('00903883838833');
          expect(body.order.people[0].address).toBe('Some Address');
          expect(body.order.people[0].photo).toBe('/somephoto');
          done();
        }
      );
    });
  });

  it('resend activation link', done => {
    request.get(
      {
        url: `${apiUrl}/orders/${order._id}/resend`
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.order._id).toBe(order._id.toString());
        expect(body.order.applicationType).toBe('person');
        expect(body.order.country).toBe('libya');
        expect(body.order.travelDocument).toBe('ordinary');
        expect(body.order.bankStatement).toBe('/someBankStatement');
        expect(body.order.workCertificate).toBe('/someWorkCertificate');
        expect(body.order.hotelReservations).toBe('/someHotelReservations');
        expect(body.order.ownershipCertificate).toBe('/someOwnershipCertificate');
        expect(body.order.people[0].givenNames).toBe('Salem Ahmed');
        expect(body.order.people[0].sureName).toBe('Mohammed');
        expect(moment(body.order.people[0].dob).year()).toBe(1986);
        expect(body.order.people[0].pob).toBe('Buckarest');
        expect(body.order.people[0].gender).toBe('male');
        expect(body.order.people[0].motherName).toBe('Farah');
        expect(body.order.people[0].passportNumber).toBe('L34UFKEU');
        expect(body.order.people[0].fatherName).toBe('Mokhtar');
        expect(moment(body.order.people[0].passportIssueDate).year()).toBe(2014);
        expect(moment(body.order.people[0].passportExpiryDate).year()).toBe(2018);
        expect(body.order.people[0].passportPhoto).toBe('/somephoto');
        expect(body.order.people[0].email).toBe('myemail@email.com');
        expect(body.order.people[0].phoneNumber).toBe('00903883838833');
        expect(body.order.people[0].address).toBe('Some Address');
        expect(body.order.people[0].photo).toBe('/somephoto');
        done();
      }
    );
  });
});

// ----------------------------------------
// helper functions
// ----------------------------------------
const { facebookToken, facebookToken2, logIn, createToken } = helpers;
