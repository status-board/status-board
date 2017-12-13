// -------------------------------
// Filesystem storage implementation
// TODO
// -------------------------------
import * as util from 'util';

export default function storageRedis(options: any) {
  this.options = options || {};
}

util.inherits(storageRedis, require('../storage-base'));

storageRedis.prototype.get = () => {
  throw 'not implemented';
};

storageRedis.prototype.set = () => {
  throw 'not implemented';
};
