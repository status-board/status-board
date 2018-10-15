import * as async from 'async';
import { Request, Response } from 'express';
import * as path from 'path';

import { readJSONFile } from '../../helpers';
import { get, getFirst } from '../../item-manager';
import logger from '../../logger';
import { resolveTemplateLocation } from '../../template-manager';

export function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}

export function readDashboardJSON(dashboardPath: any, cb: any) {
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
 * @param request
 * @param response
 */
export function listAllDashboards(packagesPath: any, request: Request, response: Response) {
  get(packagesPath, 'dashboards', '.json', (getError: any, dashboardConfigFiles: string[]) => {
    if (getError) {
      logger().error(getError);
      return response.status(400).send('Error loading dashboards');
    }

    if (dashboardConfigFiles.length === 1) {
      return response.redirect(`/${getSafeItemName(dashboardConfigFiles[0])}`);
    }

    async.map(dashboardConfigFiles, readDashboardJSON, (mapError: any, dashboardJSONs: any) => {
      if (mapError) {
        return response.status(500).send('Error reading dashboards');
      }
      resolveTemplateLocation(
        'dashboard-list.ejs',
        (templateError: any, location: any) => {
          response.render(location, {
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
 * @param request
 * @param response
 */
export function renderDashboard(packagesPath: any,
                                dashboardName: any,
                                request: Request,
                                response: Response) {
  const safeDashboardName = getSafeItemName(dashboardName);

  getFirst(
    packagesPath,
    safeDashboardName,
    'dashboards',
    '.json',
    (error: any, dashboardPath: any) => {
      if (error || !dashboardPath) {
        const statusCode = error ? 400 : 404;
        const errorMessage = `
          Trying to render the dashboard '${safeDashboardName}', but couldn't find a valid dashboard
          with that name. If the dashboard exists, is it a valid json file? Please check the console
          for error messages.
        `;
        return response.status(statusCode).send(error ? error : errorMessage);
      }
      readJSONFile(dashboardPath, (readError: any, dashboardConfig: any) => {
        if (readError) {
          return response.status(400).send('Invalid dashboard config file');
        }
        resolveTemplateLocation('dashboard.ejs', (tError: any, location: any) => {
          response.render(location, {
            dashboardConfig,
            dashboardName: safeDashboardName,
          });
        });
      });
    },
  );
}
