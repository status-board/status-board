import * as async from 'async';
import * as fs from 'fs';
import * as path from 'path';

import { readJSONFile } from '../helpers';
import { getFirst } from '../item-manager';
import logger from '../logger';

function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}

// ---------------------------------------------------------------
// Render custom JS for a dashboard
// ---------------------------------------------------------------
export function renderJsDashboard(packagesPath: any,
                                  wallboardAssetsFolder: any,
                                  dashboardName: any,
                                  req: any,
                                  res: any) {
  function pipeCustomJSFileNameToResponse(fileName: any, cb: any) {
    const assetFullPath = path.join(wallboardAssetsFolder, '/javascripts/', fileName);
    fs.readFile(assetFullPath, (error, fileContent) => {
      if (error) {
        logger().error(assetFullPath + ' not found');
      } else {
        res.write(fileContent + '\n\n');
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
        return res.status(err ? 400 : 404).send(err ? err : 'Trying to render dashboard ' +
          safeDashboardName + ', but couldn\'t find any dashboard in the packages folder');
      }
      readJSONFile(dashboardPath, (error: any, dashboardJSON: any) => {
        if (error) {
          return res.status(400).send('Error reading dashboard');
        }
        res.type('application/javascript');
        async.eachSeries(
          (dashboardJSON.layout.customJS || []),
          pipeCustomJSFileNameToResponse,
          () => {
            res.end();
          });
      });
    });
}

export function log(req: any, res: any) {
  res.render(path.join(__dirname, '../..', 'templates', 'dashboard-log.ejs'));
}
