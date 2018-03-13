import { Response } from 'express';
import { getFileContents } from './get-file-contents';

export function loadHTML(response: Response, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.html', widgetName, packagesPath, (error: any, html: any) => {
    if (!error && html) {
      response.write(html);
    }
    cb(error);
  });
}
