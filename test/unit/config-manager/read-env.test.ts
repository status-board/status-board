import { readEnv } from '../../../src/config-manager/read-env';

describe('Config Manager: Read Env', () => {
  test('Should match snapshot', () => {
    expect(readEnv).toMatchSnapshot();
  });
});
