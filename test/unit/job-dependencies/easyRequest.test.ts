import * as request from 'request';

jest.mock('request', () => jest.fn((options: any, cb: any) => {
  if (options.url === 'http://error.message') {
    cb('Request error', { statusCode: 500 }, { body: 'Page Error' });
  } else if (options.url === 'http://no.response') {
    cb(null, undefined, { body: 'No response' });
  } else if (options.url === 'http://status.code') {
    cb(null, { statusCode: 500 }, { body: 'Server Error' });
  } else if (options.url === 'http://invalid.json') {
    cb(null, { statusCode: 200 }, { body: 'Invalid JSON' });
  } else if (options.url === 'http://valid.json') {
    cb(null, { statusCode: 200 }, JSON.stringify({ body: 'Hello World!' }));
  } else {
    cb(null, { statusCode: 200 }, { body: 'Hello World!' });
  }
}));

describe('Job Dependencies: easyRequest', () => {
  test('Should return error message passed by request', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().HTML({ url: 'http://error.message' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toEqual('Request error');
      expect(body).toEqual({ body: 'Page Error' });
      expect(response).toEqual({ statusCode: 500 });
    });
  });

  test('Should return error message when request gives no response', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().HTML({ url: 'http://no.response' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toEqual('bad response from http://no.response');
      expect(body).toEqual({ body: 'No response' });
      expect(response).toBeUndefined();
    });
  });

  test('Should return error message with a status code other then 200', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().HTML({ url: 'http://status.code' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toEqual('bad statusCode: 500 from http://status.code');
      expect(body).toEqual({ body: 'Server Error' });
      expect(response).toEqual({ statusCode: 500 });
    });
  });

  test('Should return body from request', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().HTML({ url: 'http://example.com' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toBeNull();
      expect(body).toEqual({ body: 'Hello World!' });
      expect(response).toEqual({ statusCode: 200 });
    });
  });

  test('Should return error message passed by request to JSON', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().JSON({ url: 'http://error.message' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toEqual('Request error');
      expect(body).toBeUndefined();
      expect(response).toEqual({ statusCode: 500 });
    });
  });


  test('Should return error message when given invalid JSON', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().JSON({ url: 'http://invalid.json' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toEqual('invalid json response');
      expect(body).toBeUndefined();
      expect(response).toEqual({ statusCode: 200 });
    });
  });

  test('Should return JSON response from request', () => {
    const dependency = require('../../../src/job-dependencies/easyRequest/dependency').default;
    dependency().JSON({ url: 'http://valid.json' }, (errMsg: any, body: any, response: any) => {
      expect(errMsg).toBeNull();
      expect(body).toEqual({ body: 'Hello World!' });
      expect(response).toEqual({ statusCode: 200 });
    });
  });
});
