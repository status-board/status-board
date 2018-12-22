import { installDependencie } from './install-dependencie';
import { logger } from './logger';
import { runner } from './runner';
import { IOptions, IVoidCallbackWithError } from './type';

export default function (options: IOptions, callback: IVoidCallbackWithError) {
  const config = options || {};

  function featureEnabled(feature: string) {
    return feature === 'beta';
  }

  if (featureEnabled('beta')) {
    logger.log('Status Board - Beta (Enabled)');
    installDependencie(config, callback);
    runner(config, callback);
  } else {
    logger.log('Status Board - 1.x (Enabled)');
    installDependencie(config, callback);
    runner(config, callback);
  }
}
