import { configManager } from '../../src/config-manager';

describe('Config Manager', () => {
  test('Should match snapshot', () => {
    expect(configManager).toMatchSnapshot();
  });
});
