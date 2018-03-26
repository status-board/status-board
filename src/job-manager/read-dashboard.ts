import * as fs from 'fs';
import logger from '../logger';
import { IDashboardConfig } from '../type';

/**
 * Return a particular dashboard object
 *
 * @param  {string} dashboardFilePath dashboard path
 * @return {object} dashboard object
 */
export function readDashboard(dashboardFilePath: string): IDashboardConfig | void {
  const dashboardConfig = JSON.parse(fs.readFileSync(dashboardFilePath).toString());

  if (!dashboardConfig.layout) {
    return logger().error(`No layout field found in ${dashboardFilePath}`);
  }

  if (!dashboardConfig.layout.widgets) {
    return logger().error(`No widgets field found in ${dashboardFilePath}`);
  }
  return dashboardConfig;
}
