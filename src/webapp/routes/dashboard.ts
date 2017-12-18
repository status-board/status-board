import * as async from 'async';
import * as path from 'path';

import { readJSONFile } from '../../helpers';
import { get, getFirst } from '../../item-manager';
import logger from '../../logger';
import templateManager from '../../template-manager';

function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}

function readDashboardJSON(dashboardPath: any, cb: any) {
  readJSONFile(dashboardPath, (error: any, dashboard: any) => {
    if (error) {
      logger().error(`Error reading dashboard: ${dashboardPath}`);
      return cb(error);
    }

    dashboard.dashboardName = path.basename(dashboardPath, '.json');
    dashboard.friendlyDashboardName = (typeof dashboard.title === 'string') ? dashboard.title :
      dashboard.dashboardName.replace(/-/g, ' ').replace(/_/g, ' ');
    cb(null, dashboard);
  });
}

/**
 * Render dashboard list
 * @param packagesPath
 * @param req
 * @param res
 */
export function listAllDashboards(packagesPath: any, req: any, res: any) {
  get(packagesPath, 'dashboards', '.json', (error: any, dashboardConfigFiles: any) => {
    if (error) {
      logger().error(error);
      return res.status(400).send('Error loading dashboards');
    }

    if (dashboardConfigFiles.length === 1) {
      return res.redirect('/' + getSafeItemName(dashboardConfigFiles[0]));
    }

    async.map(dashboardConfigFiles, readDashboardJSON, (err: any, dashboardJSONs: any) => {
      if (err) {
        return res.status(500).send('Error reading dashboards');
      }
      templateManager().resolveTemplateLocation(
        'dashboard-list.ejs',
        (error: any, location: any) => {
          res.render(location, {
            dashboards: dashboardJSONs.sort((a: any, b: any) => {
              if (a.friendlyDashboardName < b.friendlyDashboardName) {
                return -1;
              }
              if (a.friendlyDashboardName > b.friendlyDashboardName) {
                return 1;
              }
              return 0;
            }),
          });
        });
    });
  });
}

/**
 * Render a specific dashboard
 * @param packagesPath
 * @param dashboardName
 * @param req
 * @param res
 */
export function renderDashboard(packagesPath: any, dashboardName: any, req: any, res: any) {
  const safeDashboardName = getSafeItemName(dashboardName);

  getFirst(
    packagesPath,
    safeDashboardName,
    'dashboards',
    '.json',
    (err: any, dashboardPath: any) => {
      if (err || !dashboardPath) {
        const statusCode = err ? 400 : 404;
        const errorMessage = `Trying to render the dashboard '${safeDashboardName}', but couldn't find a valid dashboard with that name. If the dashboard exists, is it a valid json file? Please check the console for error messages`;
        return res.status(statusCode).send(err ? err : errorMessage);
      }
      readJSONFile(dashboardPath, (error: any, dashboardConfig: any) => {
        if (error) {
          return res.status(400).send('Invalid dashboard config file');
        }
        templateManager().resolveTemplateLocation('dashboard.ejs', (error: any, location: any) => {
          res.render(location, {
            dashboardConfig,
            safeDashboardName,
          });
        });
      });
    });
}
