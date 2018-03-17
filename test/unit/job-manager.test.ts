import {getJobs} from '../../src/job-manager';

describe('Job Manager', () => {
  test('Should match snapshot', () => {
    expect(getJobs).toMatchSnapshot();
  });
});
