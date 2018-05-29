/* eslint-disable */

const moment = require('moment');
const request = require('request');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

module.exports = {
  user: {
    fname: 'Erlich',
    lname: 'Buckman',
    email: 'erlich@buckman.com',
    password: '11111111',
    picture: '/somephoto',
    locale: 'en',
    status: 'active'
  },
  order: {
    applicationType: 'person',
    country: 'libya',
    travelDoc: 'ordinary',
    arrivalDate: new Date(),
    bankStatement: '/someBankStatement',
    workCertificate: '/someWorkCertificate',
    hotelReservations: '/someHotelReservations',
    ownershipCertificate: '/someOwnershipCertificate',
    locale: 'ar',
    refNum: 'slsdkfj',
    people: [
      {
        givenNames: 'Salem Ahmed',
        sureName: 'Mohammed',
        dob: moment({ years: 1986, months: 3, days: 5 }),
        pob: 'Buckarest',
        gender: 'male',
        motherName: 'Farah',
        fatherName: 'Mokhtar',
        passportNumber: 'L34UFKEU',
        passportIssueDate: moment({ years: 2014, months: 3, days: 5 }),
        passportExpiryDate: moment({ years: 2018, months: 3, days: 5 }),
        passportPhoto: '/somephoto',
        email: 'myemail@email.com',
        phoneNumber: '00903883838833',
        address: 'Some Address',
        photo: '/somephoto',
        refNum: 'slsdkfj'
      }
    ]
  }
};
