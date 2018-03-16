import * as readJson from 'read-package-json';

/**
 * Install from package folder
 */
export function getValidPackageJSON(pathPackage: string, callback: any) {
  readJson(`${pathPackage}/package.json`, callback);
}
