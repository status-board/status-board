import { Response } from 'express';
import { logger } from '../../../logger';
import { stylus } from '../../../stylus';
import { addNamespacesCSSToResponse } from './add-namespaces-css-to-response';
import { getFileContents } from './get-file-contents';

export function loadStylusIfPresent(
  response: Response,
  widgetName: any,
  packagesPath: any,
  cb: any,
) {
  getFileContents('.styl', widgetName, packagesPath, (error: any, stylusContent: any) => {
    if (!error && stylusContent) {
      stylus.getWidgetCSS(stylusContent, (stylusError: any, css: any) => {
        if (!stylusError) {
          addNamespacesCSSToResponse(css, widgetName, response);
        } else {
          logger.error(stylusError);
        }
        cb(stylusError);
      });
    } else {
      cb(error);
    }
  });
}
