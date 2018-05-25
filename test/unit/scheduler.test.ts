import { Scheduler } from '../../src/Scheduler';

describe('Scheduler', () => {
  test('Should create job worker with default interval', () => {
    const jobWorker = {
      config: {},
    };
    const scheduler = new Scheduler(jobWorker);
    expect(scheduler).toEqual(
      {
        jobWorker: {
          config: {
            interval: 60000,
          },
        },
        originalInterval: 60000,
      },
    );
  });

  test('Should create job worker with minimum 1 sec', () => {
    const jobWorker = {
      config: {
        interval: 500,
      },
    };
    const scheduler = new Scheduler(jobWorker);
    expect(scheduler).toEqual(
      {
        jobWorker: {
          config: {
            interval: 1000,
          },
        },
        originalInterval: 1000,
      },
    );
  });

  test('Should create job worker', () => {
    const jobWorker = {
      config: {
        interval: 5000,
      },
    };
    const scheduler = new Scheduler(jobWorker);
    expect(scheduler).toEqual(
      {
        jobWorker,
        originalInterval: 5000,
      });
  });

  test('Should run job', (done: any) => {
    const onRunMock = jest.fn()
      .mockImplementation((config: any, dependecies: any, cb: any) => cb(null, null, null));
    const errorMock = jest.fn();
    const logMock = jest.fn();
    const pushUpdateMock = jest.fn();
    const jobWorker = {
      config: {
        interval: 1200,
      },
      dependencies: {
        logger: {
          error: errorMock,
          log: logMock,
        },
      },
      onRun: onRunMock,
      pushUpdate: pushUpdateMock,
    };
    const scheduler = new Scheduler(jobWorker);

    scheduler.start();

    expect(jobWorker.onRun).toHaveBeenCalled();
    expect(jobWorker.onRun).toHaveBeenCalledWith(
      jobWorker.config,
      jobWorker.dependencies,
      expect.any(Function),
    );
    expect(pushUpdateMock).toHaveBeenCalled();
    expect(pushUpdateMock).toHaveBeenCalledWith({ config: { interval: 1200 } });
    expect(logMock).toHaveBeenCalledWith('executed OK');
    done();
  });

  test('Should call push update with data', (done: any) => {
    const expectedData = {
      testKey: 'testValue',
    };
    const onRunMock = jest.fn()
      .mockImplementation((config: any, dependecies: any, cb: any) => cb(null, expectedData, null));
    const errorMock = jest.fn();
    const logMock = jest.fn();
    const pushUpdateMock = jest.fn();
    const jobWorker = {
      config: {
        interval: 1200,
      },
      dependencies: {
        logger: {
          error: errorMock,
          log: logMock,
        },
      },
      onRun: onRunMock,
      pushUpdate: pushUpdateMock,
    };
    const scheduler = new Scheduler(jobWorker);

    scheduler.start();

    expect(jobWorker.onRun).toHaveBeenCalled();
    expect(jobWorker.onRun).toHaveBeenCalledWith(
      jobWorker.config,
      jobWorker.dependencies,
      expect.any(Function),
    );
    expect(pushUpdateMock).toHaveBeenCalled();
    expect(pushUpdateMock).toHaveBeenCalledWith({ config: { interval: 1200 }, testKey: 'testValue' });
    expect(logMock).toHaveBeenCalledWith('executed OK');
    done();
  });

  test('Should handle job failure', (done: any) => {
    const expectedError = Error('testError');
    const onRunMock = jest.fn()
      .mockImplementation((config: any, dependecies: any, cb: any) => cb(expectedError, null, null));
    const errorMock = jest.fn();
    const logMock = jest.fn();
    const pushUpdateMock = jest.fn();
    const jobWorker = {
      config: {
        interval: 1200,
      },
      dependencies: {
        logger: {
          error: errorMock,
          log: logMock,
        },
      },
      onRun: onRunMock,
      pushUpdate: pushUpdateMock,
    };
    const scheduler = new Scheduler(jobWorker);

    scheduler.start();

    expect(jobWorker.onRun).toHaveBeenCalled();
    expect(jobWorker.onRun).toHaveBeenCalledWith(
      jobWorker.config,
      jobWorker.dependencies,
      expect.any(Function),
    );
    expect(pushUpdateMock).toHaveBeenCalled();
    expect(pushUpdateMock)
      .toHaveBeenCalledWith({ error: expectedError, config: { interval: 400 } });
    expect(errorMock).toHaveBeenCalledWith(`executed with errors: ${expectedError}`);
    done();
  });
});
