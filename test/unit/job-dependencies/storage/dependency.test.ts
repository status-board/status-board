import dependency from '../../../../src/job-dependencies/storage/dependency';
import StorageFS from '../../../../src/job-dependencies/storage/implementations/StorageFS';

jest.mock('../../../../src/job-dependencies/storage/implementations/StorageFS')

const jobWorker = { id: 1 };

describe('Job Dependencies: Storage', () => {
  test('StorageFS should be returned by dependency', () => {
    const storage = dependency(jobWorker);

    expect(storage).toBeInstanceOf(StorageFS);
    expect(StorageFS).toBeCalled();
    expect(StorageFS).toBeCalledWith(jobWorker.id, {});
  });
});
