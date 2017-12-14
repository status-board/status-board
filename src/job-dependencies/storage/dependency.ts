import fsStorage from './implementations/fs-storage';

export default function (jobWorker: any) {
  return fsStorage(jobWorker.id, {});
}
