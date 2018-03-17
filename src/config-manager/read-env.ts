import { Console } from 'console';
import * as bug from 'debug';

const debug = bug('config-manager');
const logger = new Console(process.stdout, process.stderr);

export function readEnv(configFileName: string) {
  const key = 'ATLASBOARD_CONFIG_' + configFileName;

  debug('ENV key', key);

  const environmentKey = process.env[key];

  if (environmentKey) {

    debug('ENV configuration found for', key);

    try {
      const configValue = JSON.parse(environmentKey);

      if (typeof configValue === 'object') {
        return JSON.parse(environmentKey);
      }

      logger.error(`
        ENV configuration key ${key} could not be serialized into an object: ${environmentKey}
      `);

    } catch (error) {
      throw Error(`
        ENV configuration key ${key} contains invalid JSON: ${environmentKey}
        Error: ${error}
      `);
    }
  }
}
