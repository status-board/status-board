import dependency from '../../../src/job-dependencies/logger/dependency';
import logger from '../../../src/logger';

const jobWorker = jest.fn();
const deps = {
  io: jest.fn(),
};

jest.mock('../../../src/logger', () => {
  return { default: jest.fn() };
});

describe('Job Dependencies: Logger', () => {
  test('Logger should be returned by dependency', () => {
    dependency(jobWorker, deps);

    expect(logger).toBeCalled();
    expect(logger).toBeCalledWith(jobWorker, deps.io);
  });
});
