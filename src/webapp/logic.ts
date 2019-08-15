import * as async from 'async';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { readJSONFile } from '../helpers';
import { getFirst } from '../item-manager';
import logger from '../logger';

export function getSafeItemName(itemName: string) {
  return path.basename(itemName).split('.')[0];
}

// ---------------------------------------------------------------
// Render custom JS for a dashboard
// ---------------------------------------------------------------
export function renderJsDashboard(packagesPath: any,
                                  wallboardAssetsFolder: any,
                                  dashboardName: any,
                                  request: Request,
                                  response: Response) {

  function pipeCustomJSFileNameToResponse(fileName: any, cb: any) {
    const assetFullPath = path.join(wallboardAssetsFolder, '/javascripts/', fileName);
    fs.readFile(assetFullPath, (error, fileContent) => {
      if (error) {
        logger().error(`${assetFullPath} not found`);
      } else {
        response.write(`${fileContent}\n\n`);
      }
      cb(null);
    });
  }
  const safeDashboardName = getSafeItemName(dashboardName);

  getFirst(
    packagesPath,
    safeDashboardName,
    'dashboards',
    '.json',
    (err: any, dashboardPath: any) => {
      if (err || !dashboardPath) {
        // tslint:disable-next-line:max-line-length
        return response.status(err ? 400 : 404).send(err ? err : 'Unable to find any dashboard in the packages folder');
      }
      readJSONFile(dashboardPath, (error: any, dashboardJSON: any) => {
        if (error) {
          return response.status(400).send('Error reading dashboard');
        }
        response.type('application/javascript');
        async.eachSeries(
          (dashboardJSON.layout.customJS || []),
          pipeCustomJSFileNameToResponse,
          () => {
            response.end();
          });
      });
    });
}

export function log(request: Request, response: Response): void {
  response.render(path.join(__dirname, '../..', 'templates', 'dashboard-log.ejs'));
}
