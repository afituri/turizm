/* eslint-disable */
// Disable all application logging while running tests

//console.log = function() {};

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const moment = require('moment');
const helpers = require('./helpers/objectCreators');

const { Feedback } = mongoose;

describe('Feedback', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1';
  let server;
  let req;
  let feedback;
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
    feedback = new Feedback({
      feedBackType: 'comment',
      country: 'algeria',
      locale: 'ar',
      givenNames: 'Mohamed Ali',
      sureName: 'Salem',
      email: 'ahmed.fituri@gmail.com',
      travelDocNo: '939389390',
      feedBack: 'some feed back'
    })
      .save()
      .then(() => {
        done();
      });
  });

  it('gets all feedback', done => {
    request.get(
      {
        url: `${apiUrl}/feedback`
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        expect(body.feedback[0].feedBackType).toBe('comment');
        expect(body.feedback[0].country).toBe('algeria');
        expect(body.feedback[0].locale).toBe('ar');
        expect(body.feedback[0].givenNames).toBe('Mohamed Ali');
        expect(body.feedback[0].sureName).toBe('Salem');
        expect(body.feedback[0].email).toBe('ahmed.fituri@gmail.com');
        expect(body.feedback[0].travelDocNo).toBe('939389390');
        expect(body.feedback[0].feedBack).toBe('some feed back');
        done();
      }
    );
  });

  it('creates a new feedback for Libya', done => {
    request.post(
      {
        url: `${apiUrl}/feedback`,
        form: {
          feedBackType: 'enquiry',
          country: 'libya',
          locale: 'en',
          givenNames: 'Ahmed Ali',
          sureName: 'Salem',
          email: 'ahmed.fituri@gmail.com',
          travelDocNo: '939389390',
          feedBack: 'some feed back'
        }
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(201);
        expect(body.feedback.feedBackType).toBe('enquiry');
        expect(body.feedback.country).toBe('libya');
        expect(body.feedback.locale).toBe('en');
        expect(body.feedback.givenNames).toBe('Ahmed Ali');
        expect(body.feedback.sureName).toBe('Salem');
        expect(body.feedback.email).toBe('ahmed.fituri@gmail.com');
        expect(body.feedback.travelDocNo).toBe('939389390');
        expect(body.feedback.feedBack).toBe('some feed back');
        done();
      }
    );
  });
});
