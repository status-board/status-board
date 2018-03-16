import * as fs from 'fs';
import * as path from 'path';

/**
 * Search for packages in the current folder
 */
export function checkPackagesFolder(packagesPath: string, cb: any) {
  fs.readdir(packagesPath, (error, allPackagesDir) => {
    if (error) {
      return cb(error);
    }

    let processAllPackagesDir;

    // convert to absolute path
    processAllPackagesDir = allPackagesDir.map((partialDir) => {
      return path.join(packagesPath, partialDir);
    });

    // make sure we have package.json file
    processAllPackagesDir = processAllPackagesDir.filter((dir) => {
      return fs.statSync(dir).isDirectory() && fs.existsSync(dir + '/package.json');
    });

    cb(null, processAllPackagesDir);
  });
}
