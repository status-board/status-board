function ensureSafeJobWorkerConfiguration(jobWorker: any) {
  if (!jobWorker.config.interval) {
    jobWorker.config.interval = 60 * 1000; // default to 60 secs if not provided
  } else if (jobWorker.config.interval < 1000) {
    jobWorker.config.interval = 1000; // minimum 1 sec
  }

  return jobWorker;
}

/**
 * Job scheduler
 *
 * @param jobWorker
 * @constructor
 */
export class Scheduler {
  private jobWorker: any;
  private originalInterval: number;

  constructor(jobWorker: any) {
    this.jobWorker = ensureSafeJobWorkerConfiguration(jobWorker);
    this.originalInterval = jobWorker.config.interval;
  }

  /**
   * Run job and schedule next
   */
  public start() {
    // tslint:disable-next-line no-this-assignment
    const self = this;
    const job = self.jobWorker;

    // const interval: number = this.originalInterval;

    function handleError(err: any) {
      job.dependencies.logger.error('executed with errors: ' + err);

      // in case of error retry in one third of the original interval or 1 min, whatever is lower
      job.config.interval = Math.min(self.originalInterval / 3, 60000);

      // -------------------------------------------------------------
      // Decide if we hold error notification according to widget config.
      // if the retryOnErrorTimes property found in config, the error notification
      // won't be sent until we reach that number of consecutive errors.
      // This will prevent showing too many error when connection to flaky, unreliable
      // servers.
      // -------------------------------------------------------------
      let sendError = true;
      if (job.firstRun === false) {
        if (job.config.retryOnErrorTimes) {
          job.retryOnErrorCounter = (job.retryOnErrorCounter) ? job.retryOnErrorCounter : 0;
          if (job.retryOnErrorCounter <= job.config.retryOnErrorTimes) {
            job.dependencies.logger.warn('widget with retryOnErrorTimes. attempts: ' +
              job.retryOnErrorCounter);
            sendError = false;
            job.retryOnErrorCounter += 1;
          }
        }
      } else {
        // this is the first run for this job so if it fails, we want to inform immediately
        // since it may be a configuration or dev related problem.
        job.firstRun = false;
      }

      if (sendError) {
        job.pushUpdate({ error: err, config: { interval: job.config.interval } });
      }
    }

    function handleSuccess(data: any) {
      job.retryOnErrorCounter = 0; // reset error counter on success
      job.dependencies.logger.log('executed OK');
      job.config.interval = self.originalInterval;

      let newData: any = {};
      if (data) {
        newData = data;
      }

      newData.config = { interval: job.config.interval }; // give access to interval to client
      job.pushUpdate(newData);
    }

    try {

      let cbCalled = false; // job_callback is meant to be executed only once per job run

      function jobCallback(this: any, err: any, data: any) {
        if (cbCalled) {
          job.dependencies.logger
            .warn('WARNING!!!!: job_callback executed more than once for job ' +
              job.widget_item.job + ' in dashboard ' + job.dashboard_name);
        }

        cbCalled = true;

        if (err) {
          handleError(err);
        } else {
          handleSuccess(data);
        }
        self.scheduleNext();
      }

      job.onRun.call(job, job.config, job.dependencies, jobCallback);

    } catch (e) {
      job.dependencies.logger.error('Uncaught exception executing job: ' + e);
      handleError(e);
      self.scheduleNext();
    }
  }

  /**
   * Schedules next job execution based on job's interval
   */
  private scheduleNext(this: any) {
    // tslint:disable-next-line no-this-assignment
    const self = this;
    setTimeout(
      () => {
        self.start();
      },
      this.jobWorker.config.interval,
    );
  }

}
