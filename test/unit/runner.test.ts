import * as Chance from 'chance';
import chalk from 'chalk';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import { noop } from '../../src/helpers';
import * as jobInitialiser from '../../src/job-initialiser';
import { logger } from '../../src/logger';
import { runner } from '../../src/runner';
import * as server from '../../src/webapp/server';

jest.mock('express', () => {
  return require('jest-express');
});

const socket = {
  emit: jest.fn(),
};
const io = {
  on: jest.fn((event, cb) => cb(socket)),
};
const realDate = Date;
const chance = new Chance();
const constantDate = new Date(chance.date());
const httpServer = jest.fn();
const options = {
  filters: chance.string(),
  port: chance.natural({ min: 1000, max: 9999 }),
};

describe('Runner', () => {
  beforeEach(() => {
    jest.spyOn(jobInitialiser, 'init').mockImplementation((options, cb) => cb());
    jest.spyOn(logger, 'log').mockImplementation(noop);
    jest.spyOn(server, 'server').mockImplementation(() => httpServer);
    jest.spyOn(SocketIO, 'listen').mockImplementation(() => (io));

    Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Date = realDate;
  });

  test('should setup web server', (done: () => void) => {
    const callback = (error?: string) => {
      expect(error).toBeUndefined();
      expect(server.server).toHaveBeenCalledWith(
        expect.any(Object),
        {
          packageLocations: [
            expect.stringContaining('packages'),
            expect.stringContaining('packages'),
          ],
          port: options.port,
        },
      );
      expect(logger.log)
        .toHaveBeenCalledWith('\n');
      expect(logger.log)
        .toHaveBeenCalledWith(chalk.yellow('-------------------------------------------'));
      expect(logger.log)
        .toHaveBeenCalledWith(chalk.gray(`Atlasboard listening at port ${options.port}`));
      expect(logger.log)
        .toHaveBeenCalledWith(chalk.yellow('-------------------------------------------'));
      expect(logger.log)
        .toHaveBeenCalledWith('\n');
      done();
    };

    runner(options, callback);
  });

  test('should setup socket.io server', (done: () => void) => {
    const callback = (error?: string) => {
      expect(error).toBeUndefined();
      expect(SocketIO.listen).toHaveBeenCalledWith(httpServer);
      expect(io.on).toHaveBeenCalledWith(
        'connection',
        expect.any(Function),
      );
      expect(socket.emit).toHaveBeenCalledWith(
        'serverinfo',
        {
          startTime: constantDate.getTime(),
        },
      );
      done();
    };

    runner(options, callback);
  });

  test('should setup jobs / scheduler', (done: () => void) => {
    const callback = (error?: string) => {
      expect(error).toBeUndefined();
      expect(jobInitialiser.init).toHaveBeenCalledWith(
        {
          configPath: expect.stringContaining('config'),
          deps: {
            app: expect.any(Object),
            io: io,
          },
          filters: options.filters,
          packagesPath: [
            expect.stringContaining('packages'),
            expect.stringContaining('packages'),
          ],
        },
        expect.any(Function),
      );
      done();
    };

    runner(options, callback);
  });
})
;
