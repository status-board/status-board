import * as Chance from 'chance';
import { noop } from '../../src/helpers';
import * as installDependencie from '../../src/install-dependencie';
import { logger } from '../../src/logger';
import * as runner from '../../src/runner';
import statusBoard from '../../src/status-board';

const chance = new Chance();

describe('Status Board', () => {
  let port: string;
  let install: boolean;

  beforeAll(() => {
    port = chance.natural({ min: 1000, max: 9999 }).toString();
    install = chance.bool();
    jest.spyOn(logger, 'log').mockImplementation(noop);
    jest.spyOn(runner, 'runner').mockImplementation(noop);
    jest.spyOn(installDependencie, 'installDependencie').mockImplementation(noop);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should call modules with options and callback', () => {
    const options = { port, install };
    const callback = jest.fn();

    statusBoard(options, callback);

    expect(runner.runner).toHaveBeenCalledWith(options, callback);
    expect(logger.log).toHaveBeenCalledWith('Local Status Board');
    expect(installDependencie.installDependencie).toHaveBeenCalledWith(options, callback);
  });

  test('if no options are passed call modules with a empty options object', () => {
    const options = undefined;
    const expectedOptions = {};
    const callback = jest.fn();

    statusBoard(options, callback);

    expect(runner.runner).toHaveBeenCalledWith(expectedOptions, callback);
    expect(logger.log).toHaveBeenCalledWith('Local Status Board');
    expect(installDependencie.installDependencie).toHaveBeenCalledWith(expectedOptions, callback);
  });
});
