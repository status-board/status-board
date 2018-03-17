import logger from '../../src/logger';

describe('Logger', () => {
  test('Should match snapshot', () => {
    expect(logger).toMatchSnapshot();
  });
});
