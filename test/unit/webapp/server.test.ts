import * as bodyParser from 'body-parser';
import * as Chance from 'chance';
import * as compression from 'compression';
import * as errorhandler from 'errorhandler';
import * as express from 'express';
import * as http from 'http';
import { Express } from 'jest-express/lib/express';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as configManager from '../../../src/config-manager';
import { noop } from '../../../src/helpers';
import { logger } from '../../../src/logger';
import { stylus } from '../../../src/stylus';
import * as routes from '../../../src/webapp/routes';
import { server } from '../../../src/webapp/server';

jest.mock('body-parser', () => {
  return {
    json: jest.fn(() => 'bodyParser.urlencoded'),
    urlencoded: jest.fn(() => 'bodyParser.json'),
  };
});
jest.mock('compression', () => jest.fn(() => 'compression'));
jest.mock('errorhandler', () => jest.fn(() => 'errorhandler'));
jest.mock('express', () => {
  return require('jest-express');
});
jest.mock('method-override', () => jest.fn(() => 'method-override'));
jest.mock('morgan', () => jest.fn(() => 'morgan'));

const chance = new Chance();

let app: Express;
let morganConfig: string;
let httpListen: () => void;

describe('Webapp: Server', () => {
  beforeEach(() => {
    app = new Express();

    morganConfig = chance.string();
    httpListen = jest.fn(() => 'MOCKED_HTTP_SERVER');

    jest.spyOn(http, 'createServer').mockImplementation(() => ({
      listen: httpListen,
    }));
    jest.spyOn(configManager, 'configManager')
      .mockImplementation(() => ({ morgan: morganConfig }));
    jest.spyOn(logger, 'error').mockImplementation(noop);
    jest.spyOn(stylus, 'getMiddleware')
      .mockImplementation(() => 'stylus.getMiddleware');
    jest.spyOn(routes, 'routes').mockImplementation(noop);
  });

  afterEach(() => {
    app.resetMocked();
    jest.restoreAllMocks();
  });

  test('should setup webapp server', () => {
    const options = {
      packageLocations: chance.string(),
      port: chance.natural({ min: 1000, max: 9999 }),
    };

    expect(http.globalAgent.maxSockets).toEqual(Infinity);

    const httpServer = server(app, options);

    expect(http.globalAgent.maxSockets).toEqual(100);
    expect(app.set).toBeCalledWith('port', options.port);
    expect(configManager.configManager).toBeCalledWith('logging');
    expect(morgan).toBeCalledWith(morganConfig);
    expect(app.use).toBeCalledWith(morgan(morganConfig));
    expect(app.use).toBeCalledWith(compression());
    expect(bodyParser.urlencoded).toBeCalledWith({ extended: false });
    expect(app.use).toBeCalledWith(bodyParser.urlencoded());
    expect(app.use).toBeCalledWith(bodyParser.json());
    expect(app.use).toBeCalledWith(methodOverride());
    expect(app.use).toBeCalledWith(errorhandler());
    expect(stylus.getMiddleware).toBeCalledWith({
      dest: expect.stringContaining('assets/compiled'),
      src: expect.stringContaining('assets'),
    });
    expect(app.use).toBeCalledWith(stylus.getMiddleware({}));
    expect(express.static).toBeCalledWith(expect.stringContaining('assets'));
    expect(express.static).toBeCalledWith(expect.stringContaining('assets/compiled'));
    expect(routes.routes).toBeCalledWith(app, options.packageLocations);
    expect(http.createServer).toBeCalledWith(app);
    expect(httpListen).toBeCalledWith(options.port);
    expect(httpServer).toEqual('MOCKED_HTTP_SERVER');
  });

  test('should log error if http can not bind port', () => {
    const options = {
      packageLocations: chance.string(),
      port: false,
    };

    server(app, options);

    expect(logger.error).toBeCalledWith(`Error binding http server to port ${options.port}`);
  });
});
