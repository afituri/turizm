/* eslint-disable */

const app = require('../server');
const request = require('request');
const mongoose = require('../models/mongoose');
const fileSystem = require('fs');
const path = require('path');
const helpers = require('./helpers/objectCreators');

describe('Image', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1';
  let server;
  let user;
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
    done();
  });

  // ----------------------------------------
  // Image API endpoints
  // ----------------------------------------

  // signAndUploadImagetoS3Bucket
  it('sign the image and upload successfully', done => {
    const filePath = path.join(__dirname, '/images/sample.jpg');
    let fileType = 'image/jpeg',
      fileName = 'sample.jpg',
      url = '';

    request.get(
      {
        url: `${apiUrl}/images/image-upload-url?file-name=${fileName}&file-type=${fileType}`
      },
      (err, res, body) => {
        body = JSON.parse(body);
        expect(res.statusCode).toBe(200);
        const stats = fileSystem.statSync(filePath);
        fileSystem.createReadStream(filePath).pipe(
          request(
            {
              method: 'PUT',
              url: body.signedRequest, // uploading the image using signedRequest
              headers: {
                'Content-Length': stats.size
              }
            },
            (err, res, body) => {
              expect(res.statusCode).toBe(200);
              done();
            }
          )
        );
      }
    );
  });
  // ----------------------------------------
  // helper functions
  // ----------------------------------------
});
