import * as path from 'path';
import { resolveLocation } from './resolve-location';

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
                                  itemType: 'dashboards' | 'jobs' | 'widgets',
                                  extension: string) {
  let searchCriteria = '';
  if (name.indexOf('#') > -1) {
    const packageName = name.split('#')[0];
    const itemParsedName = name.split('#')[1];
    // package/jobs/job1/job1.js
    searchCriteria = path.join(
      packageName,
      resolveLocation(itemParsedName, itemType, extension),
    );
  } else {
    // jobs/job1/job1.js
    searchCriteria = resolveLocation(name, itemType, extension);
  }

  searchCriteria = path.sep + searchCriteria;

  return items.filter((item: any) => {
    return item.indexOf(searchCriteria) > -1;
  });
}
