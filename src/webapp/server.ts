import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as errorhandler from 'errorhandler';
import * as express from 'express';
import * as http from 'http';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as path from 'path';

import configManager from '../config-manager';
import { logger } from '../logger';
import stylus from '../stylus';
import routes from './routes';

export default function (app: express.Application, options: any) {
  http.globalAgent.maxSockets = 100;

  const atlasboardAssetsFolder = path.join(__dirname, '../../assets');
  const localAssetsFolder = path.join(process.cwd(), 'assets');

  const compiledAssetsFolder = path.join(localAssetsFolder, 'compiled');

  app.set('port', options.port);

  app.use(morgan(configManager('logging').morgan));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(errorhandler());

  app.use(stylus().getMiddleware({
    dest: compiledAssetsFolder,
    src: atlasboardAssetsFolder,
  }));

  // -----------------------------------------
  //  Expose both wallboard and Atlasboard assets.
  //  Local wallboard assets take precedence
  // -----------------------------------------
  app.use(express.static(localAssetsFolder));
  app.use(express.static(compiledAssetsFolder));
  app.use(express.static(atlasboardAssetsFolder));

  routes(app, options.packageLocations);

  const httpServer = http.createServer(app).listen(app.get('port'));
  if (!app.get('port')) {
    logger.error(`Error binding http server to port ${options.port}`);
  }
  return httpServer;
}
