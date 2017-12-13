import * as fs from 'fs';
import * as path from 'path';
import * as extend from 'xtend';
import { get, resolveCandidates } from './item-manager';

/**
 * Return a particular dashboard object
 *
 * @param  {string} dashboardFilePath dashboard path
 * @return {object} dashboard object
 */
function readDashboard(dashboardFilePath: any) {
  const dashboardConfig = JSON.parse(fs.readFileSync(dashboardFilePath));

  if (!dashboardConfig.layout) {
    throw('No layout field found in ' + dashboardFilePath);
  }

  if (!dashboardConfig.layout.widgets) {
    throw('No widgets field found in ' + dashboardFilePath);
  }
  return dashboardConfig;
}

/**
 * Returns true if dashboard matches a particular regex filter
 *
 * @param  {string} dashboardFullPath dashboard full path
 * @param  {string} filter regex
 * @return {boolean}
 */
function matchDashboardFilter(dashboardFullPath: any, filter: any) {
  const dashboardName = path.basename(dashboardFullPath);
  return dashboardName.match(filter);
}

/**
 * Returns true if job matches a particular regex filter
 *
 * @param  {string} jobName job name
 * @param  {string} filter regex
 * @return {boolean}
 */
function matchJobFilter(jobName: any, filter: any) {
  return jobName.match(filter);
}

/**
 * Process all jobs from a dashboard
 *
 * @param  {array} allJobs all available jobs
 * @param  {string} dashboardName dashboard name
 * @param  {object} dashboardConfig dashboard config
 * @param  {object} filters filters, if any
 * @return {array} related jobs
 */
function processDashboard(allJobs: any, dashboardName: any, dashboardConfig: any, filters: any) {
  const jobs = [];
  for (let i = 0, l = dashboardConfig.layout.widgets.length; i < l; i++) {
    const jobItem = dashboardConfig.layout.widgets[i];
    if (jobItem.job) { // widgets can run without a job, displaying just static html.
      if (filters.jobFilter) {
        if (!matchJobFilter(jobItem.job, filters.jobFilter)) {
          continue;
        }
      }

      const candidateJobs = resolveCandidates(allJobs, jobItem.job, 'jobs', '.js');
      if (!candidateJobs.length) {
        throw '  ERROR RESOLVING JOB ' +
        '\n   No job file found for "' + jobItem.job + '" in ' + dashboardName +
        '\n   Have you pulled all the packages dependencies? (They are git submodules.)' +
        '\n\n   $ git submodule init' +
        '\n   $ git submodule update\n';
      }

      const job = {
        configKey: jobItem.config,
        dashboard_name: path.basename(dashboardName, '.json'),
        job_name: jobItem.job,
        widget_item: jobItem,
      };

      const jobRequire = require(candidateJobs[0]);
      if (typeof jobRequire === 'function') {
        job.onRun = jobRequire;
      } else {
        job.onRun = jobRequire.onRun || function () {
        };
        job.onInit = jobRequire.onInit || function () {
        };
      }

      jobs.push(job);
    }
  }
  return jobs;
}

export default {
  /**
   * Return the jobs for all available dashboards in all the packages
   *
   * @param  {object}   options  options object
   * @param  {Function} callback
   */
  getJobs(options: any, callback: any) {

    const packagesPath = options.packagesPath;
    const filters = options.filters || {};

    const configPath = path.join(options.configPath, '/dashboard_common.json');
    let generalDashboardConfig = {};

    let jobs = [];

    // ----------------------------------------------
    // general config is optional, but if it exists it needs to be a valid file
    // ----------------------------------------------
    if (fs.existsSync(configPath)) {
      try {
        generalDashboardConfig = JSON.parse(fs.readFileSync(configPath)).config;
        if (!generalDashboardConfig) {
          throw 'invalid format. config property not found';
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
      get(packagesPath, 'jobs', '.js', (err: any, allJobs: any) => {
        if (err) {
          return callback(err);
        }

        for (let d = 0, dl = dashboardConfigFiles.length; d < dl; d++) {
          const dashboardName = dashboardConfigFiles[d];

          if (filters.dashboardFilter) {
            if (!matchDashboardFilter(dashboardName, filters.dashboardFilter)) {
              continue;
            }
          }

          let dashboardConfig;
          let dashboardJobs;
          try {
            dashboardConfig = readDashboard(dashboardName);
            dashboardJobs = processDashboard(allJobs, dashboardName, dashboardConfig, filters);
          } catch (e) {
            return callback(e);
          }

          // add config to job, extending for the same config key in general config, if any
          dashboardJobs = dashboardJobs.map((job) => {
            // Multiple configurations:
            //  local overrides global
            //  config n+1 overrides config n
            if (Array.isArray(job.configKey)) {
              const configs = job.configKey.map((key) => {
                return extend(generalDashboardConfig[key], dashboardConfig.config[key]);
              });
              job.config = extend.apply(null, configs);
            } else { // single configuration
              job.config = extend(generalDashboardConfig[job.configKey], dashboardConfig.config[job.configKey]);
            }

            return job;
          });

          jobs = jobs.concat(dashboardJobs);
        }

        callback(null, jobs);
      });
    });
  },
};
