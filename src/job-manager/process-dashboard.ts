import * as path from 'path';
import { noop } from '../helpers';
import { resolveCandidates } from '../item-manager';
import { logger } from '../logger';
import { matchJobFilter } from './match-job-filter';

/**
 * Process all jobs from a dashboard
 *
 * @param  {array} allJobs all available jobs
 * @param  {string} dashboardName dashboard name
 * @param  {object} dashboardConfig dashboard config
 * @param  {object} filters filters, if any
 * @return {array} related jobs
 */
export function processDashboard(
  allJobs: any,
  dashboardName: string,
  dashboardConfig: any,
  filters: any,
) {
  const jobs = [];
  for (let i = 0, l = dashboardConfig.layout.widgets.length; i < l; i += 1) {
    const jobItem = dashboardConfig.layout.widgets[i];
    if (jobItem.job) { // widgets can run without a job, displaying just static html.
      if (filters.jobFilter) {
        if (!matchJobFilter(jobItem.job, filters.jobFilter)) {
          continue;
        }
      }

      const candidateJobs = resolveCandidates(allJobs, jobItem.job, 'jobs', '.js');
      if (!candidateJobs.length) {
        logger.error(`
        ERROR RESOLVING JOB
        No job file found for "${jobItem.job}" in ${dashboardName}
        Have you pulled all the packages dependencies? (They are git submodules.)

        $ git submodule init
        $ git submodule update
        `);
      }

      const job: any = {
        configKey: jobItem.config,
        dashboard_name: path.basename(dashboardName, '.json'),
        job_name: jobItem.job,
        widget_item: jobItem,
      };
      const jobRequire = require(candidateJobs[0]);

      if (typeof jobRequire === 'function') {
        job.onRun = jobRequire;
      } else {
        job.onRun = jobRequire.onRun || noop;
        job.onInit = jobRequire.onInit || noop;
      }

      jobs.push(job);
    }
  }
  return jobs;
}
