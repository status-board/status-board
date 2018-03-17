import * as fs from 'fs';
import * as path from 'path';

export function readConfigIfExists(fileName: string) {
  let configFileName = fileName;

  if (!path.extname(configFileName)) {
    configFileName = configFileName + '.js';
  }

  if (fs.existsSync(configFileName)) {
    return require(configFileName);
  }

  return {};
}
