import * as path from 'path';

/**
 * Returns true if dashboard matches a particular regex filter
 *
 * @param  {string} dashboardFullPath dashboard full path
 * @param  {string | RegExp} filter regex
 * @return {RegExpMatchArray | null}
 */
export function matchDashboardFilter(
  dashboardFullPath: string,
  filter: string | RegExp,
): RegExpMatchArray | null {
  const dashboardName = path.basename(dashboardFullPath);
  return dashboardName.match(filter);
}
