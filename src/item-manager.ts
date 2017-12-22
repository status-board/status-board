import * as async from 'async';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'underscore';
import logger from './logger';

/**
 * Filters will be applied to a certain type to decide if that
 * item should be included in the list to be returned.
 * You can match extensions, do sanity checks (valid JSON), etc.
 */
const filters: any = {
  dashboards(dashboardPath: any) {
    try {
      const contentJSON = JSON.parse(fs.readFileSync(dashboardPath).toString());
      return (contentJSON.enabled !== false);
    } catch (e) {
      logger().error(`## ERROR ## ${dashboardPath} has an invalid format or file doesn't exist\n`);
      return false;
    }
  },
};

/**
 * Returns relative path to packages path based on item type.
 * The main purpose of this function is to be able to handle the different way
 * widgets and jobs paths are resolved compared to the way dashboards paths are.
 *
 * @param {string} name item name to match. i.e: widget1
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : file extension
 *
 * @return {string} relative path to item: jobs/job1/job1.js
 */
export function resolveLocation(name: string, itemType: string, extension: string): string {
  const useDirectoryLevel = ((itemType === 'widgets') || (itemType === 'jobs'));
  if (useDirectoryLevel) {
    // jobs/job1/job1.js
    return path.join(itemType, name, name + extension);
  }

  // dashboards/dashboard.json
  return path.join(itemType, name + extension);
}

/**
 * Get the items that match the particular filter.
 *
 * @param {[string]} items : list of file paths
 * @param {string} name item name to match. It can be namespaced. i.e: atlassian#widget1, widget1
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 */
export function resolveCandidates(items: string[],
                                  name: string,
                                  itemType: string,
                                  extension: string) {
  let searchCriteria = '';
  if (name.indexOf('#') > -1) {
    const packageName = name.split('#')[0];
    const itemParsedName = name.split('#')[1];
    // package/jobs/job1/job1.js
    searchCriteria = path.join(
      packageName,
      this.resolveLocation(itemParsedName, itemType, extension),
    );
  } else {
    // jobs/job1/job1.js
    searchCriteria = this.resolveLocation(name, itemType, extension);
  }

  searchCriteria = path.sep + searchCriteria;

  return items.filter((item: any) => {
    return item.indexOf(searchCriteria) > -1;
  });
}

/**
 * Return first candidate found matching name, type and extension
 *
 * @param {[string]} packagesPath : list of directories to find packages in.
 * @param {string} itemName item name to match.
 * It can be namespaced. i.e: atlassian#widget1, widget1
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 */
export function getFirst(packagesPath: string[],
                         itemName: string,
                         itemType: string,
                         extension: string,
                         callback: any) {
  // tslint:disable-next-line no-var-self
  const thiz = this;
  this.get(packagesPath, itemType, extension, (error: any, items: any) => {
    if (error) {
      return callback(error);
    }

    const candidates = thiz.resolveCandidates(items, itemName, itemType, extension);
    callback(null, candidates.length ? candidates[0] : null);
  });
}

/**
 * Return list of items found in any package within packagesPath
 *
 * @param {[string]} packagesPath : list of directories to find packages in.
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 */
export function get(packagesPath: string[], itemType: string, extension: string, callback: any) {
  this.getByPackage(packagesPath, itemType, extension, (error: any, results: any) => {
    if (error) {
      return callback(error);
    }
    let items: string[] = [];
    results.forEach((packages: any) => {
      items = items.concat(packages.items);
    });
    callback(null, items);
  });
}

/**
 * Return list of items found in any package within packagesPath
 * Items are returned separated by package
 *
 * @param {[string]} packagesPath : list of directories to find packages in.
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 */
export function getByPackage(packagesPath: string[],
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
