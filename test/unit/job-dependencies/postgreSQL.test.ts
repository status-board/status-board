import * as pg from 'pg';
import { noop } from '../../../src/helpers';
import dependency from '../../../src/job-dependencies/postgreSQL/dependency';
import { logger } from '../../../src/logger';

const config = {};

describe('Job Dependencies: PostgreSQL', () => {
  const connect = jest.fn((callback: any) => {
    callback(null);
  });
  const end = jest.fn();
  const query = jest.fn((connectionString: string, callback: any) => {
    callback(null, 'Hello World!');
  });

  beforeEach(() => {
    jest.spyOn(logger, 'error').mockImplementation(noop);
    jest.spyOn(pg, 'Client').mockImplementation((conf: any) => {
      if (conf.response === 'connectError') {
        return {
          connect: jest.fn((callback: any) => {
            callback({ stack: 'ERROR' });
          }),
          end,
          query,
        };
      }

      if (conf.response === 'queryError') {
        return {
          connect,
          end,
          query: jest.fn((connectionString: string, callback: any) => {
            callback('ERROR');
          }),
        };
      }

      return {
        connect,
        end,
        query,
      };
    });
  });

  afterEach(() => {
    logger.error.mockRestore();
    pg.Client.mockRestore();
  });

  test('Should setup PostgreSQL', () => {
    dependency(config);
    expect(pg.Client).toBeCalled();
    expect(pg.Client).toBeCalledWith(config);
  });

  test('Should query PostgreSQL', (done: any) => {
    const postgreSQL = dependency(config);
    postgreSQL.query('connectionString', 'query', 'params', (error: any, results: any) => {
      expect(error).toBeNull();
      expect(results).toEqual('Hello World!');
      expect(connect).toBeCalled();
      expect(connect).toBeCalledWith(expect.anything());
      expect(query).toBeCalled();
      expect(query).toBeCalledWith('connectionString', expect.anything());
      expect(end).toBeCalled();
      done();
    });
  });

  test('Should throw a connection error', (done: any) => {
    const postgreSQL = dependency({ response: 'connectError' });
    postgreSQL.query('connectionString', 'query', 'params', (error: any, results: any) => {
      expect(error).toEqual({ stack: 'ERROR' });
      expect(results).toBeUndefined();
      expect(logger.error).toBeCalled();
      expect(logger.error).toBeCalledWith(`Error connecting to postgreSQL: ERROR`);
      done();
    });
  });

  test('Should throw a query error', () => {
    function throwQueryError() {
      const postgreSQL = dependency({ response: 'queryError' });
      postgreSQL.query('connectionString', 'query', 'params', noop);
    }

    expect(throwQueryError).toThrowError(`Error executing postgreSQL query: ERROR`);
  });
});
