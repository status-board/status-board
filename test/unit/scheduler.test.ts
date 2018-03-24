import { Scheduler } from '../../src/Scheduler';

describe('Scheduler', () => {
  test('Should match snapshot', () => {
    expect(Scheduler).toMatchSnapshot();
  });
});
