import { stylus } from '../../src/stylus';

describe('Stylus', () => {
  test('Should match snapshot', () => {
    expect(stylus).toMatchSnapshot();
  });
});
