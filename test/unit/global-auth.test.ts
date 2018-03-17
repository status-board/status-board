import { globalAuth } from '../../src/global-auth';

describe('Globsl Auth', () => {
  test('Should match snapshot', () => {
    expect(globalAuth).toMatchSnapshot();
  });
});
