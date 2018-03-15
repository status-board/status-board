import * as fs from 'fs';
import { logger } from '../logger';

/**
 * Filters will be applied to a certain type to decide if that
 * item should be included in the list to be returned.
 * You can match extensions, do sanity checks (valid JSON), etc.
 */
export const filters: any = {
  dashboards(dashboardPath: any) {
    try {
      const contentJSON = JSON.parse(fs.readFileSync(dashboardPath).toString());
      return (contentJSON.enabled !== false);
    } catch (e) {
      logger.error(`## ERROR ## ${dashboardPath} has an invalid format or file doesn't exist\n`);
      return false;
    }
  },
};
