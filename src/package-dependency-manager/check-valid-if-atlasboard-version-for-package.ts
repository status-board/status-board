import * as path from 'path';
import * as semver from 'semver';
import { getValidPackageJSON } from './get-valid-package-json';

// in both test and production env will be located here.
const atlasboardPackageJsonPath = path.join(__dirname, '../../');

/**
 * Install from package folder
 */
export function checkValidIfAtlasboardVersionForPackage(pathPackage: string, callback: any) {
  getValidPackageJSON(pathPackage, (err: any, packageJson: any) => {
    if (err) {
      return callback(err);
    }

    getValidPackageJSON(atlasboardPackageJsonPath, (error: any, atlasboardPackageJson: any) => {
      if (error) {
        return callback('package.json not found for atlasboard at ' + atlasboardPackageJsonPath);
      }

      if (packageJson.engines && packageJson.engines.atlasboard) {
        const ok = semver.satisfies(atlasboardPackageJson.version, packageJson.engines.atlasboard);
        const msg = `
          Atlasboard version does not satisfy package dependencies at ${pathPackage}.
          Please consider updating your version of atlasboard.
          Version required: ${packageJson.engines.atlasboard}
          Atlasboard version: ${atlasboardPackageJson.version}
        `;

        callback(ok ? null : msg);
      } else {
        // not atlasboard reference in engines node
        callback(null);
      }
    });
  });
}
