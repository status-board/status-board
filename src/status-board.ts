import chalk from 'chalk';
import * as express from 'express';
import * as path from 'path';
import { listen } from 'socket.io';

import { init } from './job-initialiser';
import { logger } from './logger';
import { installDependencies } from './package-dependency-manager';
import server from './webapp/server';

function runner(options: any, callback: any) {
  const packagesLocalFolder = path.join(process.cwd(), '/packages');
  const packagesAtlasboardFolder = path.join(__dirname, '../packages');
  const configPath = path.join(process.cwd(), '/config');

  // -----------------------------------
  // Init web server
  // -----------------------------------

  const app = express();
  const httpServer = server(app, {
    packageLocations: [packagesLocalFolder, packagesAtlasboardFolder],
    port: options.port,
  });

  logger.log('\n');
  logger.log(chalk.yellow('-------------------------------------------'));
  logger.log(chalk.gray(`Atlasboard listening at port ${options.port}`));
  logger.log(chalk.yellow('-------------------------------------------'));
  logger.log('\n');

  // -----------------------------------
  // Init socket.io server
  // -----------------------------------

  const io: SocketIO.Server = listen(httpServer);
  const startTime = new Date().getTime();
  io.on('connection', (socket) => {
    socket.emit('serverinfo', { startTime });
  });

  // -----------------------------------
  // Init jobs / scheduler
  // -----------------------------------

  const jobOptions = {
    configPath,
    deps: {
      app,
      io,
    },
    filters: options.filters,
    packagesPath: [
      packagesLocalFolder,
      packagesAtlasboardFolder,
    ],
  };

  init(jobOptions, callback);
}

function installDependencie(options: any, callback: any) {
  const packagesLocalFolder = path.join(process.cwd(), '/packages');

  if (options.install) {
    logger.log(chalk.gray('Installing dependencies...'));
    installDependencies([packagesLocalFolder], (error: any) => {
      if (error) {
        return callback(error);
      }
      logger.log(chalk.green('done!'));
    });
  }
}

export default function (options: any, callback: any) {
  const config = options || {};

  installDependencie(config, callback);
  runner(config, callback);
}
