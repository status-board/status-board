import * as Chance from 'chance';
import dependency from '../../../src/job-dependencies/app/dependency';

const chance = new Chance();

describe('Job Dependencies: App', () => {
  test('Should return the dependencies app', () => {
    const jobWorker: any = {};
    jobWorker[chance.string()] = chance.string();
    const deps = {
      app: chance.string(),
    };

    const response = dependency(jobWorker, deps);

    expect(response).toEqual(deps.app);
  });
});
