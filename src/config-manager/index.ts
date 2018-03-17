import * as path from 'path';
import * as extend from 'xtend';
import { readConfigIfExists } from './read-config-if-exists';
import { readEnv } from './read-env';

export function configManager(configFileName: any) {
  const localConfigFilePath = path.join(process.cwd(), 'config', configFileName);
  const atlasboardConfigFilePath = path.join(__dirname, '../../config/', configFileName);

  return extend(
    readConfigIfExists(atlasboardConfigFilePath),
    readConfigIfExists(localConfigFilePath),
    readEnv(configFileName),
  );
}
