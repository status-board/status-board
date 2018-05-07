import { installDependencie } from './install-dependencie';
import { logger } from './logger';
import { runner } from './runner';
import { IOptions, IVoidCallbackWithError } from './type';

export default function (options: IOptions, callback: IVoidCallbackWithError) {
  logger.log('Local Status Board');
  const config = options || {};

  installDependencie(config, callback);
  runner(config, callback);
}
