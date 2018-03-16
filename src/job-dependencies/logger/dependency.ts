import * as Tracer from 'tracer';
import logger from '../../logger';

export default function (jobWorker: any, deps: any): Tracer.Logger {
  return logger(jobWorker, deps.io);
}
