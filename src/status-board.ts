import { installDependencie } from './install-dependencie';
import { logger } from './logger';
import { runner } from './runner';

export default function (options: any, callback: any) {
  logger.log('Local Status Board');
  const config = options || {};

  installDependencie(config, callback);
  runner(config, callback);
}
