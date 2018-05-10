import * as Chance from 'chance';
import * as bug from 'debug';

jest.mock('debug');

const chance = new Chance();
let configFileName: string;
let envValue: string;
let failedEnvValue: string;
describe('Config Manager: Read Env', () => {
  beforeEach(() => {
    configFileName = chance.string({ pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_' });
    const key1 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const value1 = chance.string();
    const key2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const value2 = chance.string();
    envValue = `{"${key1}":"${value1}","${key2}":"${value2}"}`;
    failedEnvValue = 'iudTLoMPB1';

    process.env.ATLASBOARD_CONFIG_FAIL_READ_ENV = failedEnvValue;
    process.env.ATLASBOARD_CONFIG_READ_ENV = envValue;
  });

  afterEach(() => {
    delete process.env.ATLASBOARD_FAIL_CONFIG_READ_ENV;
    delete process.env.ATLASBOARD_CONFIG_READ_ENV;
  });

  test('Should setup debug', () => {
    const readEnv = require('../../../src/config-manager/read-env').readEnv;

    readEnv('READ_ENV');

    expect(bug).toHaveBeenCalledWith('config-manager');
  });

  test('Should log environment key to debug', () => {
    const readEnv = require('../../../src/config-manager/read-env').readEnv;

    readEnv('READ_ENV')

    expect(bug()).toHaveBeenCalledWith('ENV key', `ATLASBOARD_CONFIG_READ_ENV`);
  });

  test('Should log ENV key to debug and return value', () => {
    const readEnv = require('../../../src/config-manager/read-env').readEnv;

    const configValue = readEnv('READ_ENV');

    expect(bug()).toHaveBeenCalledWith('ENV configuration found for', 'ATLASBOARD_CONFIG_READ_ENV');
    expect(configValue).toEqual(JSON.parse(envValue));
  });

  test('Should throw error when value is not valid JSON', () => {
    const readEnv = require('../../../src/config-manager/read-env').readEnv;

    function executeReadEnv() {
      readEnv('FAIL_READ_ENV');
    }

    expect(executeReadEnv).toThrow(`
        ENV configuration key ATLASBOARD_CONFIG_FAIL_READ_ENV contains invalid JSON: ${failedEnvValue}
        Error: SyntaxError: Unexpected token i in JSON at position 0
      `);
  });
});
