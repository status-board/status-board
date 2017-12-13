import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';

import { readJSONFile } from '../helpers';
import { getFirst } from '../item-manager';
import logger from '../logger';

function getSafeItemName(itemName) {
  return path.basename(itemName).split('.')[0];
}


// ---------------------------------------------------------------
// Render custom JS for a dashboard
// ---------------------------------------------------------------
export function renderJsDashboard(packagesPath: any, wallboardAssetsFolder: any, dashboardName: any, req: any, res: any) {
  function pipeCustomJSFileNameToResponse(fileName: any, cb: any) {
    const assetFullPath = path.join(wallboardAssetsFolder, '/javascripts/', fileName);
    fs.readFile(assetFullPath, function (err, fileContent) {
      if (err) {
        logger().error(assetFullPath + ' not found');
      }
      else {
        res.write(fileContent + '\n\n');
      }
      cb(null);
    });
  }

  dashboardName = getSafeItemName(dashboardName);

  getFirst(packagesPath, dashboardName, 'dashboards', '.json', (err: any, dashboardPath: any) => {
    if (err || !dashboardPath) {
      return res.status(err ? 400 : 404).send(err ? err : 'Trying to render dashboard ' +
        dashboardName + ', but couldn\'t find any dashboard in the packages folder');
    }
    readJSONFile(dashboardPath, function (err, dashboardJSON) {
      if (err) {
        return res.status(400).send('Error reading dashboard');
      } else {
        res.type('application/javascript');
        async.eachSeries((dashboardJSON.layout.customJS || []), pipeCustomJSFileNameToResponse, function () {
          res.end();
        });
      }
    });
  });
}

export function log(req: any, res: any) {
  res.render(path.join(__dirname, '../..', 'templates', 'dashboard-log.ejs'));
}
