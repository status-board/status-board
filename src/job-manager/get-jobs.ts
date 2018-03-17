import * as fs from 'fs';
import * as path from 'path';
import * as extend from 'xtend';
import { get } from '../item-manager';
import { logger } from '../logger';
import { matchDashboardFilter } from './match-dashboard-filter';
import { processDashboard } from './process-dashboard';
import { readDashboard } from './read-dashboard';

/**
 * Return the jobs for all available dashboards in all the packages
 *
 * @param  {object}   options  options object
 * @param  {Function} callback
 */
export function getJobs(options: any, callback: any) {
  const packagesPath = options.packagesPath;
  const filters = options.filters || {};

  const configPath = path.join(options.configPath, '/dashboard_common.json');
  let generalDashboardConfig: any = {};

  let jobs: any[] = [];

  // ----------------------------------------------
  // general config is optional, but if it exists it needs to be a valid file
  // ----------------------------------------------
  if (fs.existsSync(configPath)) {
    try {
      generalDashboardConfig = JSON.parse(fs.readFileSync(configPath).toString()).config;
      if (!generalDashboardConfig) {
        logger.error('invalid format. config property not found');
      }
    } catch (e) {
      return callback('ERROR reading general config file...' + configPath);
    }
  }

  // ----------------------------------------------
  // get all dashboards from all packages folder
  // ----------------------------------------------
  get(packagesPath, 'dashboards', '.json', (err: any, dashboardConfigFiles: any) => {
    if (err) {
      return callback(err);
    }

    // ----------------------------------------------
    // get all jobs from those packages
    // ----------------------------------------------
    get(packagesPath, 'jobs', '.js', (error: any, allJobs: any) => {
      if (error) {
        return callback(err);
      }

      for (let d = 0, dl = dashboardConfigFiles.length; d < dl; d += 1) {
        const dashboardName = dashboardConfigFiles[d];

        if (filters.dashboardFilter) {
          if (!matchDashboardFilter(dashboardName, filters.dashboardFilter)) {
            continue;
          }
        }

        let dashboardConfig: any;
        let dashboardJobs;
        try {
          dashboardConfig = readDashboard(dashboardName);
          dashboardJobs = processDashboard(allJobs, dashboardName, dashboardConfig, filters);
        } catch (error) {
          return callback(error);
        }

        // add config to job, extending for the same config key in general config, if any
        dashboardJobs = dashboardJobs.map((job) => {
          // Multiple configurations:
          //  local overrides global
          //  config n+1 overrides config n
          if (Array.isArray(job.configKey)) {
            const configs = job.configKey.map((key: any) => {
              return extend(
                generalDashboardConfig[key],
                dashboardConfig.config[key],
              );
            });
            job.config = extend.apply(null, configs);
          } else { // single configuration
            job.config = extend(
              generalDashboardConfig[job.configKey],
              dashboardConfig.config[job.configKey],
            );
          }

          return job;
        });

        jobs = jobs.concat(dashboardJobs);
      }

      callback(null, jobs);
    });
  });
}
