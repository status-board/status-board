import * as fs from 'fs';
import * as traverse from 'traverse';

import logger from './logger';

const ENV_VAR_REGEX = /\$\{([^}]+)\}/;

export default function (file: any) {
  let globalAuth = {};

  try {
    globalAuth = JSON.parse(fs.readFileSync(file).toString());
  } catch (e) {
    if (e.code === 'ENOENT') {
      logger().warn(`Authentication file not found in ${file}.`);
      logger().warn('You may want to create your own.');
      logger().warn('You can also define the place where the credential file will be located by ' +
        'editing the auth file configuration property \'authenticationFilePath\'');
    } else {
      logger().error('Error reading ' + file + '. It may contain invalid json format');
    }
    return globalAuth;
  }

  try {
    traverse(globalAuth).forEach(function (val) {
      if ('string' === typeof val) {
        const match = ENV_VAR_REGEX.exec(val);
        let modified;
        let newVal;
        while (match !== null) {
          const envName = match[1];
          let envVal = process.env[envName];

          if (envVal === undefined) {
            // tslint:disable-next-line max-line-length
            logger().warn(`Authentication file referenced var \${${envName}}, which was not present in environment.`);
            envVal = '';
          }

          newVal = val.substring(
            0,
            match.index,
          ) + envVal + val.substring(
            match.index + match[0].length,
          );
          modified = true;
        }

        if (modified) {
          this.update(newVal);
        } else {
          this.update(val);
        }
      }
    });
  } catch (error) {
    throw Error(`
      Error parsing the auth file ${file} with env variables.
      Error: ${error}
    `);
  }

  return globalAuth;
}
