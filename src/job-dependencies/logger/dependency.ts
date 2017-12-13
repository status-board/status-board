import logger from '../../logger';

export default function (jobWorker: any, deps: any) {
  return logger(jobWorker, deps.io);
}
