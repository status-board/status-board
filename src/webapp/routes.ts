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

export default function (app: any, packagesPath: any) {
  const wallboardAssetsFolder = path.join(process.cwd(), 'assets');

  // -----------------------------------------
  //  Log
  // -----------------------------------------
  app.route('/log')
    .get((req: any, res: any) => {
      if (configManager('logging').liveLoggingWebAccess) {
        log(req, res);
      } else {
        // tslint:disable-next-line max-line-length
        res.status(403).end('Live logging it disabled. It must be enabled in the "logging" configuration file');
      }
    });

  // -----------------------------------------
  //  Resources for specific widget
  // -----------------------------------------
  app.route('/widgets/resources')
    .get((req: any, res: any) => {
      renderWidgetResource(path.join(process.cwd(), 'packages'), req.query.resource, req, res);
    });

  // -----------------------------------------
  //  JS for a specific widget
  // -----------------------------------------
  app.route('/widgets/:widget/js')
    .get((req: any, res: any) => {
      renderJsWidget(packagesPath, req.params.widget, req, res);
    });

  // -----------------------------------------
  //  HTML and CSS for a specific widget
  // -----------------------------------------
  app.route('/widgets/:widget')
    .get((req: any, res: any) => {
      renderHtmlWidget(packagesPath, req.params.widget, req, res);
    });

  // -----------------------------------------
  //  Dashboard
  // -----------------------------------------
  app.route('/:dashboard')
    .get((req: any, res: any) => {
      renderDashboard(packagesPath, req.params.dashboard, req, res);
    });

  // -----------------------------------------
  //  Dashboard JS
  // -----------------------------------------
  app.route('/:dashboard/js')
    .get((req: any, res: any) => {
      renderJsDashboard(packagesPath, wallboardAssetsFolder, req.params.dashboard, req, res);
    });

  // -----------------------------------------
  // List all available dashboards
  // -----------------------------------------
  app.route('/')
    .get((req: any, res: any) => {
      listAllDashboards(packagesPath, req, res);
    });
}
