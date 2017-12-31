// -------------------------------
// Filesystem storage implementation
// TODO
// -------------------------------
import { logger } from '../../../logger';
import IStorageBase from '../IStorageBase';

export default class StorageRedis implements IStorageBase {
  private options: string;

  constructor(options: any) {
    this.options = options || {};
  }

  public get() {
    logger.error('not implemented');
  }

  public set() {
    logger.error('not implemented');
  }
}
