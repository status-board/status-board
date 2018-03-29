import * as Chance from 'chance';
import { Console } from 'console';
import * as tracer from 'tracer';
import * as configManager from '../../src/config-manager';
import { noop } from '../../src/helpers';
import { IServer, Server } from '../helpers/socket';

jest.mock('../../src/config-manager', () => {
  let config = {};

  return {
    SET_CONFIG_RETURN: (data: any) => {
      config = data;
    },
    configManager: jest.fn(() => config),
  };
});

const chance = new Chance();
const configStuff = {
  logger: {
    dateformat: 'HH:MM:ss.L',
    format: [
      '{{timestamp}} <{{title}}> {{message}} ({{file}})',
      {
        error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}',
      },
    ],
    level: 3,
  },
};
const tracerLogger = (
  config: {
    transport: (
      data: {
        level: string,
        output: string,
      },
    ) => void,
  }) => {
  const transport = config.transport;
  return {
    debug: jest.fn((msg: string) => {
      transport({
        level: 'debug',
        output: msg,
      });
    }),
    error: jest.fn((msg: string) => {
      transport({
        level: 'error',
        output: msg,
      });
    }),
    info: jest.fn((msg: string) => {
      transport({
        level: 'info',
        output: msg,
      });
    }),
    log: jest.fn((msg: string) => {
      transport({
        level: 'log',
        output: msg,
      });
    }),
    trace: jest.fn((msg: string) => {
      transport({
        level: 'trace',
        output: msg,
      });
    }),
  };
};

let server: IServer;
let ioServer: SocketIO.Server;
let ioClient: SocketIOClient.Socket;

const jobWorker = {
  dashboard_name: chance.name(),
  job_name: chance.name(),
};

describe('Logger', () => {
  beforeEach((done: () => void) => {
    server = new Server();
    ioServer = server.getIoServer();
    ioClient = server.getIoClient();

    jest.spyOn(ioServer, 'emit');
    jest.spyOn(tracer, 'colorConsole')
      .mockImplementation((loggerConfig) => tracerLogger(loggerConfig));
    done();
  });

  afterEach((done: () => void) => {
    server.stopServer();
    jest.restoreAllMocks();
    done();
  });

  test('Logger should be a instance of Console', () => {
    const log = require('../../src/logger').logger;
    expect(log).toBeInstanceOf(Console);
  });

  test('Logger should emit to socket if a socket server is passed', () => {
    const logger = require('../../src/logger');
    jest.spyOn(logger.logger, 'log')
      .mockImplementation(noop);
    const message = chance.string();
    const expectedMessage = `[dashboard: ${jobWorker.dashboard_name}] [job: ${jobWorker.job_name}] ${message}`;

    logger.default(jobWorker, ioServer).log(message);

    expect(logger.logger.log).toHaveBeenCalled();
    expect(logger.logger.log).toHaveBeenCalledWith(expectedMessage);
    expect(ioServer.emit).toHaveBeenCalled();
    expect(ioServer.emit).toHaveBeenCalledWith(
      'server',
      {
        msg: expectedMessage,
        type: 'log',
      },
    );
  });

  test('Logger should use jobWorker info in logger', () => {
    const logger = require('../../src/logger');
    jest.spyOn(logger.logger, 'log')
      .mockImplementation(noop);
    const message = chance.string();
    const expectedMessage = `[dashboard: ${jobWorker.dashboard_name}] [job: ${jobWorker.job_name}] ${message}`;

    logger.default(jobWorker).error(message);

    expect(logger.logger.log).toHaveBeenCalled();
    expect(logger.logger.log).toHaveBeenCalledWith(expectedMessage);
    expect(ioServer.emit).not.toHaveBeenCalled();
  });

  test('Should use blank config if configManager doesn\'t return one', () => {
    configManager.SET_CONFIG_RETURN({});
    const logger = require('../../src/logger');
    jest.spyOn(logger.logger, 'log')
      .mockImplementation(noop);
    const message = chance.string();

    logger.default().info(message);

    expect(logger.logger.log).toHaveBeenCalled();
    expect(logger.logger.log).toHaveBeenCalledWith(message);
    expect(ioServer.emit).not.toHaveBeenCalled();
  });

  test('Should use config returned by configManager', () => {
    configManager.SET_CONFIG_RETURN(configStuff);
    const logger = require('../../src/logger');
    jest.spyOn(logger.logger, 'log')
      .mockImplementation(noop);
    const message = chance.string();

    logger.default().info(message);

    expect(logger.logger.log).toHaveBeenCalled();
    expect(logger.logger.log).toHaveBeenCalledWith(message);
    expect(ioServer.emit).not.toHaveBeenCalled();
  });
});
