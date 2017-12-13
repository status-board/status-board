import * as fs from 'fs';
import * as traverse from 'traverse';

import generalLogger from './logger';

const ENV_VAR_REGEX = /\$\{([^}]+)\}/;

export default function (file: any) {
  let globalAuth = {};

  try {
    globalAuth = JSON.parse(fs.readFileSync(file));
  } catch (e) {
    if (e.code === 'ENOENT') {
      generalLogger().warn('Authentication file not found in ' + file +
        '. You may want to create your own. You can also define the place where the credential file will be located ' +
        ' by editing the auth file configuration property \'authenticationFilePath\'');
    } else {
      generalLogger().error('Error reading ' + file + '. It may contain invalid json format');
    }
    return globalAuth;
  }

  try {
    traverse(globalAuth).forEach(function (val) {
      if ('string' === typeof val) {
        let match;
        let modified;
        while ((match = ENV_VAR_REGEX.exec(val)) !== null) {
          const envName = match[1];
          let envVal = process.env[envName];
          if (envVal === undefined) {
            generalLogger().warn('Authentication file referenced var ${' + envName + '}, which was not present in environment');
            envVal = '';
          }
          val = val.substring(0, match.index) + envVal + val.substring(match.index + match[0].length);
          modified = true;
        }

        if (modified === true) {
          this.update(val);
        }
      }
    });
  } catch (e) {
    generalLogger().error('Error parsing the auth file ' + file + ' with env variables');
  }

  return globalAuth;
}
