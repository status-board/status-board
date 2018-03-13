import { Request, Response } from 'express';
import { getSafeItemName } from './get-safe-item-name';
import { loadCSSIfPresent } from './load-css-if-present';
import { loadHTML } from './load-html';
import { loadStylusIfPresent } from './load-stylus-if-present';

export function renderHtmlWidget(packagesPath: any,
                                 widgetName: any,
                                 request: Request,
                                 response: Response) {
  const safeWidgetName = getSafeItemName(widgetName);

  response.type('text/html');

  loadStylusIfPresent(response, safeWidgetName, packagesPath, () => {
    loadCSSIfPresent(response, safeWidgetName, packagesPath, () => {
      loadHTML(response, safeWidgetName, packagesPath, (error: any) => {
        if (error) {
          response.status(500).send(`Error rendering widget: ${error}`);
        } else {
          response.end();
        }
      });
    });
  });
}
