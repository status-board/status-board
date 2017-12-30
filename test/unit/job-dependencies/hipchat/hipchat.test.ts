import * as Chance from 'chance';
import * as qstring from 'querystring';
import { create } from '../../../../src/job-dependencies/hipchat/hipchat';
import { logger } from '../../../../src/logger';

const chance = new Chance();
const options = {
  api_key: chance.guid(),
  request: {
    get: jest.fn((opts: any, cb: any) => {
      if (opts.url.includes('room/4')) {
        cb('Error', { statusCode: 503 }, 'Internal Error');
      } else if (opts.url.includes('room/3')) {
        cb('Error', undefined, 'Internal Error');
      } else if (opts.url.includes('room/2')) {
        cb('Error', { statusCode: 502 }, 'Internal Error');
      } else {
        cb(null, { statusCode: 200 }, { a: 1 });
      }
    }),
    post: jest.fn((opts: any, cb: any) => cb(null, { statusCode: 200 }, { a: 1 })),
  },
};

describe('Job Dependencies: Hipchat', () => {
  const spy: any = {};

  beforeAll(() => {
    spy.console = jest.spyOn(logger, 'error').mockImplementation(() => {
    });
    spy.console = jest.spyOn(logger, 'log').mockImplementation(() => {
    });
  });

  afterAll(() => {
    spy.console.mockRestore();
  });

  test('Should call hipchat rest api to send room message', (done: any) => {
    const hitchat = create(options);
    const roomId = chance.natural({ min: 1, max: 9999 });
    const from = chance.name();
    const message = chance.paragraph({ sentences: 1 });
    const notify = chance.pickone([0, 1]);
    hitchat.message(
      roomId,
      from,
      message,
      notify,
      (errMsg: any, response: any, body: any) => {
        expect(errMsg).toBeNull();
        expect(response).toEqual(200);
        expect(body).toEqual({ a: 1 });
        expect(options.request.post).toHaveBeenLastCalledWith(
          {
            body: qstring.stringify({ from, message, notify, room_id: roomId }),
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            url: `https://api.hipchat.com/v1/rooms/message?format=json&auth_token=${options.api_key}`,
          },
          expect.anything(),
        );
        done();
      });
  });

  test('Should call hipchat rest api for room info', (done: any) => {
    const hitchat = create(options);
    hitchat.roomInfo(
      1,
      (errMsg: any, response: any, body: any) => {
        expect(errMsg).toBeNull();
        expect(response).toEqual(200);
        expect(body).toEqual({ a: 1 });
        expect(options.request.get).toHaveBeenLastCalledWith(
          {
            json: true,
            url: `https://api.hipchat.com/v2/room/1?format=json&auth_token=${options.api_key}`,
          },
          expect.anything(),
        );
        done();
      });
  });

  test('Should throw error when request receives unknown error status code', (done: any) => {
    const hitchat = create(options);
    hitchat.roomInfo(
      2,
      (errMsg: any, response: any, body: any) => {
        expect(errMsg).toEqual('Error');
        expect(response).toEqual(502);
        expect(body).toEqual('Internal Error');
        done();
      });
  });

  test('Should throw error when request receive give no response', (done: any) => {
    const hitchat = create(options);
    hitchat.roomInfo(
      3,
      (errMsg: any, response: any, body: any) => {
        expect(errMsg).toEqual('Error');
        expect(response).toBeNull();
        expect(body).toEqual('Internal Error');
        done();
      });
  });

  test('Should throw error when request receives know error status code', (done: any) => {
    const hitchat = create(options);
    hitchat.roomInfo(
      4,
      (errMsg: any, response: any, body: any) => {
        expect(errMsg).toEqual('Error The method you requested is currently unavailable (due to maintenance or high load; Internal Error');
        expect(response).toEqual(503);
        expect(body).toEqual('Internal Error');
        done();
      });
  });

  test('Should console error when no api key is given', () => {
    const hitchat = create({});
    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledWith('api_key required');
  });

  test('Should console log when given no callback', () => {
    const hitchat = create(options);
    hitchat.roomInfo(1);

    expect(logger.log).toBeCalled();
    expect(logger.log).toBeCalledWith('No callback');
  });
});
