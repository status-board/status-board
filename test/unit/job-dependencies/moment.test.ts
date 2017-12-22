import * as moment from 'moment';
import dependency from '../../../src/job-dependencies/moment/dependency';

describe('Job Dependencies: Moment', () => {
  test('Moment should be returned by dependency', () => {
    expect(dependency()).toEqual(moment);
  });
});
