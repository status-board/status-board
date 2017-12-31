import { noop } from '../../../../../src/helpers';
import StorageRedis from '../../../../../src/job-dependencies/storage/implementations/StorageRedis';
import { logger } from '../../../../../src/logger';

describe('Job Dependencies: StorageRedis', () => {
  const spy: any = {};

  beforeAll(() => {
    spy.console = jest.spyOn(logger, 'error').mockImplementation(noop);
  });

  afterAll(() => {
    spy.console.mockRestore();
  });

  test('StorageRedis get should console a error', () => {
    const storage = new StorageRedis({});
    storage.get();
    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledWith('not implemented');
  });

  test('StorageRedis set should console a error', () => {
    const storage = new StorageRedis(undefined);
    storage.set();
    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledWith('not implemented');
  });
});
