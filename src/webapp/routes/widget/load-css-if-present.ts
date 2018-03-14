import { Response } from 'express';
import { addNamespacesCSSToResponse } from './add-namespaces-css-to-response';
import { getFileContents } from './get-file-contents';

export function loadCSSIfPresent(
  response: Response,
  widgetName: string,
  packagesPath: string,
  cb: any,
) {
  getFileContents('.css', widgetName, packagesPath, (error: any, css: any) => {
    if (!error && css) {
      addNamespacesCSSToResponse(css, widgetName, response);
    }
    cb(error);
  });
}
