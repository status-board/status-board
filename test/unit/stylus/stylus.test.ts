import { stylus } from '../../../src/stylus';

describe('Stylus', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test('Should match snapshot', () => {
    expect(stylus).toMatchSnapshot();
  });
});
