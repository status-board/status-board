// -------------------------------
// Filesystem storage implementation
// TODO
// -------------------------------
import logger from '../../../logger';

/**
 * TODO
 * Usage of util.inherits() is discouraged. Please use the ES6 class and extends keywords to get
 * language level inheritance support. Also note that the two styles are semantically incompatible.
 */
// util.inherits(storageRedis, require('../storage-base'));

export default function storageRedis(options: any) {
  this.options = options || {};

  return {
    get: () => {
      logger().error('not implemented');
    },
    set: () => {
      logger().error('not implemented');
    },
  };
}
