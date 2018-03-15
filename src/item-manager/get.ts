import { getByPackage } from './get-by-package';

/**
 * Return list of items found in any package within packagesPath
 *
 * @param {[string]} packagesPath : list of directories to find packages in.
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 * @param {function} callback : return list of items
 */
export function get(
  packagesPath: string | string[],
  itemType: 'dashboards' | 'jobs' | 'widgets',
  extension: string,
  callback: any,
) {
  getByPackage(packagesPath, itemType, extension, (error: any, results: any) => {
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
