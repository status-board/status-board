import chalk from 'chalk';
import * as express from 'express';
import * as path from 'path';
import { listen, Server } from 'socket.io';
import { init } from './job-initialiser';
import { logger } from './logger';
import { server } from './webapp/server';

export function runner(options: any, callback: any) {
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
  const io: Server = listen(httpServer);
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
