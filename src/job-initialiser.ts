import configManager from './config-manager';
import EventQueue from "./event-queue";
import { fillDependencies } from './job-dependencies/loader';
import jobsManager from './job-manager';
import loadGlobalAuth from './global-auth';
import logger from './logger';
import Scheduler from './scheduler';

export function init(options: any, cb: any) {

  jobsManager.getJobs(options, (err: any, jobWorkers: any) => {
    if (err) {
      return cb(err);
    }

    const globalAuth = loadGlobalAuth(configManager('auth').authenticationFilePath);

    if (!jobWorkers.length) {
      logger().warn('No jobs found matching the current configuration and filters');
    } else {
      const eventQueue = new EventQueue(options.deps.io);
      jobWorkers.forEach((jobWorker: any, index: any) => {

        // unique id for this widget in the wallboard
        jobWorker.id = jobWorker.dashboard_name + '-' +
          (jobWorker.widget_item.r || jobWorker.widget_item.row) + '-' +
          (jobWorker.widget_item.c || jobWorker.widget_item.col);

        jobWorker.pushUpdate = (data: any) => {
          eventQueue.send(jobWorker.id, data);
        };

        // add security info
        jobWorker.config.globalAuth = globalAuth;

        if (jobWorker.widget_item.enabled !== false) {

          fillDependencies(jobWorker, options.deps);

          if (jobWorker.onInit) {
            jobWorker.onInit.call(jobWorker, jobWorker.config, jobWorker.dependencies);
          }

          if (jobWorker.onRun) {
            setTimeout(
              () => {
                const scheduler = new Scheduler(jobWorker);
                scheduler.start();
              },
              index * 1500,
            ); // avoid a concurrency peak on startup
          }
        } else { // job is disabled
          jobWorker.pushUpdate({ error: 'disabled' });
        }

      });
    }
    return cb();
  });
}
