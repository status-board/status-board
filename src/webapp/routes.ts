import { Application, Request, Response } from 'express';
import * as path from 'path';

import configManager from '../config-manager';
import {
  log,
  renderJsDashboard,
} from './logic';
import {
  listAllDashboards,
  renderDashboard,
} from './routes/dashboard';
import {
  renderHtmlWidget,
  renderJsWidget,
  renderWidgetResource,
} from './routes/widget';

export default function (app: Application, packagesPath: any) {
  const wallboardAssetsFolder = path.join(process.cwd(), 'assets');

  // -----------------------------------------
  //  Log
  // -----------------------------------------
  app.route('/log')
    .get((request: Request, response: Response) => {
      if (configManager('logging').liveLoggingWebAccess) {
        log(request, response);
      } else {
        // tslint:disable-next-line max-line-length
        response.status(403).end('Live logging it disabled. It must be enabled in the "logging" configuration file');
      }
    });

  // -----------------------------------------
  //  Resources for specific widget
  // -----------------------------------------
  app.route('/widgets/resources')
    .get((request: Request, response: Response) => {
      renderWidgetResource(
        path.join(process.cwd(), 'packages'),
        request.query.resource,
        request,
        response,
      );
    });

  // -----------------------------------------
  //  JS for a specific widget
  // -----------------------------------------
  app.route('/widgets/:widget/js')
    .get((request: Request, response: Response) => {
      renderJsWidget(packagesPath, request.params.widget, request, response);
    });

  // -----------------------------------------
  //  HTML and CSS for a specific widget
  // -----------------------------------------
  app.route('/widgets/:widget')
    .get((request: Request, response: Response) => {
      renderHtmlWidget(packagesPath, request.params.widget, request, response);
    });

  // -----------------------------------------
  //  Dashboard
  // -----------------------------------------
  app.route('/:dashboard')
    .get((request: Request, response: Response) => {
      renderDashboard(packagesPath, request.params.dashboard, request, response);
    });

  // -----------------------------------------
  //  Dashboard JS
  // -----------------------------------------
  app.route('/:dashboard/js')
    .get((request: Request, response: Response) => {
      renderJsDashboard(
        packagesPath,
        wallboardAssetsFolder,
        request.params.dashboard,
        request,
        response,
      );
    });

  // -----------------------------------------
  // List all available dashboards
  // -----------------------------------------
  app.route('/')
    .get((request: Request, response: Response) => {
      listAllDashboards(packagesPath, request, response);
    });
}
