import chalk from 'chalk';
import * as path from 'path';
import { logger } from './logger';
import { installDependencies } from './package-dependency-manager';
import { IOptions, IVoidCallbackWithError } from './type';

export function installDependencie(
  options: IOptions,
  callback: IVoidCallbackWithError,
) {
  const packagesLocalFolder = path.join(process.cwd(), '/packages');

  if (options.install) {
    logger.log(chalk.gray('Installing dependencies...'));
    installDependencies([packagesLocalFolder], (error: Error) => {
      if (error) {
        return callback(error);
      }
      logger.log(chalk.green('done!'));
      return callback();
    });
  } else {
    return callback();
  }
}
