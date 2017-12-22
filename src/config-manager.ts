import * as bug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import * as extend from 'xtend';
import logger from './logger';

const debug = bug('config-manager');

function readConfigIfExists(fileName: any) {
  let configFileName = fileName;

  if (!path.extname(configFileName)) {
    configFileName = configFileName + '.js';
  }

  if (fs.existsSync(configFileName)) {
    return require(configFileName);
  }

  return {};
}

function readEnv(configFileName: string) {
  const key = 'ATLASBOARD_CONFIG_' + configFileName;

  debug('ENV key', key);

  if (process.env[key]) {

    debug('ENV configuration found for', key);

    try {
      const configValue = JSON.parse(process.env[key]);

      if (typeof configValue === 'object') {
        return JSON.parse(process.env[key]);
      }

      logger().error(`
        ENV configuration key ${key} could not be serialized into an object: ${process.env[key]}
      `);

    } catch (error) {
      throw Error(`
        ENV configuration key ${key} contains invalid JSON: ${process.env[key]}
        Error: ${error}
      `);
    }
  }
}

export default function (configFileName: any) {
  const localConfigFilePath = path.join(process.cwd(), 'config', configFileName);
  const atlasboardConfigFilePath = path.join(__dirname, '../config/', configFileName);

  return extend(
    readConfigIfExists(atlasboardConfigFilePath),
    readConfigIfExists(localConfigFilePath),
    readEnv(configFileName),
  );
}
