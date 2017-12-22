import * as async from 'async';
import dependency from '../../../src/job-dependencies/async/dependency';

describe('Job Dependencies: Async', () => {
  test('Async should be returned by dependency', () => {
    expect(dependency()).toEqual(async);
  });
});
