// ---------------------------------------------------------------
// Render specific resource for a widget
// - resource format: <package>/<widget>/<resource>
//   ex: atlassian/blockers/icon.png
// ---------------------------------------------------------------
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export function renderWidgetResource(localPackagesPath: string,
                                     resource: string,
                                     request: Request,
                                     response: Response) {
  let input;
  let resourcePath;
  if (resource) {
    // Sanitization
    input = resource.split('/');
    const packageName = input[0];
    const widgetName = input[1];
    const resourceName = input[2];

    // TODO: add extra sensitization
    resourcePath = path.join(
      localPackagesPath,
      packageName,
      'widgets',
      widgetName,
      resourceName,
    );
  }

  if (!resource) {
    response.status(400).send('resource id not specified');
  } else if (input.length !== 3) {
    response.status(400).send('bad input');
  } else if (fs.existsSync(resourcePath)) {
    response.sendFile(resourcePath);
  } else {
    response.status(404).send('resource not found');
  }
}
