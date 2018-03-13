import { Request, Response } from 'express';
import { getFirst } from '../../../item-manager';
import { logger } from '../../../logger';
import { getSafeItemName } from './get-safe-item-name';

export function renderJsWidget(packagesPath: any,
                               widgetName: any,
                               request: Request,
                               response: Response) {
  response.type('application/javascript');

  const safeWidgetName = getSafeItemName(widgetName);

  getFirst(packagesPath, safeWidgetName, 'widgets', '.js', (error: any, jsFile: any) => {
    if (error || !jsFile) {
      const msg = error ? error : `JS file not found for widget ${widgetName}`;
      logger.error(msg);
      response.status(400).send(`Error rendering widget: ${msg}`);
    } else {
      response.sendFile(jsFile);
    }
  });
}
