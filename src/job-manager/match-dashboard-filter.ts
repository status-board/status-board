import * as path from 'path';

/**
 * Returns true if dashboard matches a particular regex filter
 *
 * @param  {string} dashboardFullPath dashboard full path
 * @param  {string} filter regex
 * @return {boolean}
 */
export function matchDashboardFilter(dashboardFullPath: string, filter: string) {
  const dashboardName = path.basename(dashboardFullPath);
  return dashboardName.match(filter);
}
