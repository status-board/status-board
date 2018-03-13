import * as fs from 'fs';
import { getFirst } from '../../../item-manager';

export function getFileContents(extension: any, widgetName: any, packagesPath: any, callback: any) {
  // tslint:disable-next-line no-shadowed-variable
  getFirst(packagesPath, widgetName, 'widgets', extension, (error: any, path: any) => {
    if (error || !path) {
      return callback(error ? error : 'File does not exist');
    }

    fs.readFile(path, 'utf-8', callback);
  });
}
