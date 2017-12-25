// -------------------------------
// Filesystem storage implementation
// TODO
// -------------------------------
import logger from '../../../logger';
import StorageBase from '../StorageBase';

class StorageRedis extends StorageBase {
  private options: string;

  constructor(options: any) {
    super();
    this.options = options || {};
  }

  public get() {
    logger().error('not implemented');
  }

  public set() {
    logger().error('not implemented');
  }
}
