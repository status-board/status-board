import * as path from 'path';

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
export function resolveLocation(
  name: string,
  itemType: 'dashboards' | 'jobs' | 'widgets',
  extension: string,
): string {
  const useDirectoryLevel = ((itemType === 'widgets') || (itemType === 'jobs'));
  if (useDirectoryLevel) {
    // jobs/job1/job1.js
    return path.join(itemType, name, name + extension);
  }

  // dashboards/dashboard.json
  return path.join(itemType, name + extension);
}
