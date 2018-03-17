import { init } from '../../src/job-initialiser';

describe('Job Initialiser', () => {
  test('Should match snapshot', () => {
    expect(init).toMatchSnapshot();
  });
});
