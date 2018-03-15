import * as async from 'async';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'underscore';
import { filters } from './filters';

/**
 * Return list of items found in any package within packagesPath
 * Items are returned separated by package
 *
 * @param {[string]} packagesPath : list of directories to find packages in.
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 */
export function getByPackage(packagesPath: string | string[],
                             itemType: string,
                             extension: string,
                             callback: any) {
  let processedPackagePath;

  if (!Array.isArray(packagesPath)) {
    processedPackagePath = [packagesPath];
  } else {
    processedPackagePath = packagesPath;
  }

  function readItemsFromPackageDir(dir: any, cb: any) {
    const packages: any = { dir };

    const itemDir = path.join(dir, itemType);
    if (!fs.existsSync(itemDir)) {
      packages.items = [];
      return cb(null, packages);
    }

    // this functions parses:
    // - packages/default/<itemType>/*
    // - packages/otherpackages/<itemType>/*
    // for dashboards, or:
    // - packages/default/<itemType>/*/*.js
    // - packages/otherpackages/<itemType>/*/*.js
    // for jobs and widgets
    fs.readdir(itemDir, (error: any, items: any) => {
      if (error) {
        return cb(error);
      }

      let selectedItems: any[] = [];
      items.forEach((itemName: any) => {
        let item = path.join(itemDir, itemName);
        const stat = fs.statSync(item);

        if (stat.isDirectory()) {
          // /job/job1/job1.js
          item = path.join(item, itemName + extension);
        }

        if (path.extname(item) === extension) {
          if (fs.existsSync(item)) {
            selectedItems.push(item);
          }
        }
      });

      if (filters[itemType]) { // change to use custom filters for itemType
        selectedItems = selectedItems.filter(filters[itemType]);
      }

      packages.items = selectedItems;
      return cb(null, packages);
    });
  }

  // this function read all the packages from the provided directory packagesPath:
  // - packages/default/*
  // - packages/otherpackages/*
  // and calls readItemsFromPackageDir for every one of them
  // tslint:disable-next-line no-shadowed-variable
  function fillPackages(packagesPath: any, cb: any) {
    fs.readdir(packagesPath, (error: any, allPackagesDir: any) => {
      if (error) {
        return cb(error);
      }

      let processAllPackagesDir;

      // convert to absolute path
      processAllPackagesDir = allPackagesDir.map((partialDir: any) => {
        return path.join(packagesPath, partialDir);
      });

      // get only valid directories
      processAllPackagesDir = processAllPackagesDir.filter((dir: any) => {
        return fs.statSync(dir).isDirectory();
      });

      // read items from every package and flatten results
      async.map(processAllPackagesDir, readItemsFromPackageDir, (mapError: any, results: any) => {
        if (mapError) {
          return cb(mapError);
        }
        cb(null, _.flatten(results));
      });
    });
  }

  // process all package paths
  async.map(
    processedPackagePath.filter(fs.existsSync),
    fillPackages,
    (error: any, results: any) => {
      if (error) {
        return callback(error);
      }
      callback(null, _.flatten(results));
    });
}
