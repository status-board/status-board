import { Scheduler } from '../../src/scheduler';

describe('Scheduler', () => {
  test('Should match snapshot', () => {
    expect(Scheduler).toMatchSnapshot();
  });
});
