export default function (jobWorker: any) {
  const fsStorageClass = require('./implementations/fs-storage.js');
  return new fsStorageClass(jobWorker.id, {});
}
