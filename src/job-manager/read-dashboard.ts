import * as fs from 'fs';
import { logger } from '../logger';

/**
 * Return a particular dashboard object
 *
 * @param  {string} dashboardFilePath dashboard path
 * @return {object} dashboard object
 */
export function readDashboard(dashboardFilePath: string) {
  const dashboardConfig = JSON.parse(fs.readFileSync(dashboardFilePath).toString());

  if (!dashboardConfig.layout) {
    logger.error(`No layout field found in ${dashboardFilePath}`);
  }

  if (!dashboardConfig.layout.widgets) {
    logger.error(`No widgets field found in ${dashboardFilePath}`);
  }
  return dashboardConfig;
}
