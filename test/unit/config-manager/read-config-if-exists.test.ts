import { readConfigIfExists } from '../../../src/config-manager/read-config-if-exists';

describe('Config Manager: Read Config If Exists', () => {
  test('Should match snapshot', () => {
    expect(readConfigIfExists).toMatchSnapshot();
  });
});
