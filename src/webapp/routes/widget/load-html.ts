import { Response } from 'express';
import { getFileContents } from './get-file-contents';

export function loadHTML(response: Response, widgetName: string, packagesPath: string, cb: any) {
  getFileContents('.html', widgetName, packagesPath, (error: any, html: any) => {
    if (!error && html) {
      response.write(html);
    }
    cb(error);
  });
}
