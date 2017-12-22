import * as _ from 'underscore';
import dependency from '../../../src/job-dependencies/underscore/dependency';

describe('Job Dependencies: Underscore', () => {
  test('Underscore should be returned by dependency', () => {
    expect(dependency()).toEqual(_);
  });
});
