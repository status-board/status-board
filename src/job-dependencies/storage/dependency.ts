import StorageFS from './implementations/StorageFS';

export default function (jobWorker: any) {
  return new StorageFS(jobWorker.id, {});
}
