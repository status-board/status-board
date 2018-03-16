import * as async from 'async';
import * as fs from 'fs';
import * as _ from 'underscore';
import { checkPackagesFolder } from './check-packages-folder';
import {
  checkValidIfAtlasboardVersionForPackage,
} from './check-valid-if-atlasboard-version-for-package';
import { install } from './install';

export function installDependencies(packagesPath: any, callback: any) {
  // Process all available package containers
  async.map(packagesPath.filter(fs.existsSync), checkPackagesFolder, (mapError, results) => {
    if (mapError) {
      return callback(mapError);
    }

    if (results) {
      const paths = _.flatten(results);
      async.eachSeries(paths, checkValidIfAtlasboardVersionForPackage, (seriesError: any) => {
        if (seriesError) {
          return callback(seriesError);
        }

        async.eachSeries(paths, install, (error: any) => {
          callback(error);
        });
      });
    }
  });
}
