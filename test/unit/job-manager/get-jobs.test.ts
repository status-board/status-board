import { getJobs } from '../../../src/job-manager';

describe('Job Manager: Get Jobs', () => {
  test('Should match snapshot', () => {
    expect(getJobs).toMatchSnapshot();
  });
});
