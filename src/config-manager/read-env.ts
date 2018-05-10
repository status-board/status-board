import * as bug from 'debug';

const debug = bug('config-manager');

export function readEnv(configFileName: string) {
  const key = 'ATLASBOARD_CONFIG_' + configFileName;

  debug('ENV key', key);

  const environmentKey = process.env[key];

  if (environmentKey) {

    debug('ENV configuration found for', key);

    try {
      return JSON.parse(environmentKey);
    } catch (error) {
      throw Error(`
        ENV configuration key ${key} contains invalid JSON: ${environmentKey}
        Error: ${error}
      `);
    }
  }
}
