import * as Chance from 'chance';
import dependency from '../../../../src/job-dependencies/hipchat/dependency';
import * as hipchat from '../../../../src/job-dependencies/hipchat/hipchat';

jest.mock('../../../../src/job-dependencies/hipchat/hipchat', () => {
  return {
    create: jest.fn(),
  };
});

const chance = new Chance();
const jobWorker = {
  config: {
    globalAuth: {
      hipchat: {
        token: chance.guid(),
      },
    },
  },
};
const jobWorkerWithoutToken = {
  config: {
    globalAuth: {},
  },
};

describe('Job Dependencies: Hipchat Dependency', () => {
  test('Should return the hipchat client', () => {
    const token = jobWorker.config.globalAuth.hipchat.token;
    dependency(jobWorker);
    expect(hipchat.create).toHaveBeenCalled();
    expect(hipchat.create).toHaveBeenCalledWith({ api_key: token });
  });

  test('Should return null when there is no hipchat token', () => {
    expect(dependency(jobWorkerWithoutToken)).toBeNull();
  });
});
