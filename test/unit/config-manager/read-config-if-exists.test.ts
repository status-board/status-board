import * as fs from 'fs';

import { readConfigIfExists } from '../../../src/config-manager/read-config-if-exists';

jest.mock(
  '../../../config/dummy.js',
  () => {
    return {
      value: 'foo',
    };
  },
  {
    virtual: true,
  },
);

describe('Config Manager: Read Config If Exists', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'existsSync')
      .mockImplementation((fileName: string) => fileName.includes('dummy'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should return a empty object if no file exist', () => {
    const configFile = readConfigIfExists('../../config/fail');

    expect(configFile).toEqual({});
  });

  test('Should add a .js to file path', () => {
    readConfigIfExists('../../config/pass');

    expect(fs.existsSync).toHaveBeenCalledWith('../../config/pass.js');
  });

  test('Should return dummy file', () => {
    const configFile = readConfigIfExists('../../config/dummy');

    expect(configFile).toHaveProperty('value', 'foo');
  });
});
