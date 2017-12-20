// -------------------------------
// Filesystem storage implementation
// -------------------------------
import * as fs from 'fs';
import * as path from 'path';
import logger from '../../../logger';

/**
 * TODO
 * Usage of util.inherits() is discouraged. Please use the ES6 class and extends keywords to get
 * language level inheritance support. Also note that the two styles are semantically incompatible.
 */
// util.inherits(storageFS, require('../storage-base'));

export default function storageFS(storageKey: any, options: any) {
  this.storageKey = storageKey;
  this.options = options || {};
  this.storagePath = options.storagePath || path.join(process.cwd(), '/job-data-storage.json');

  return {
    get: (key: any, callback: any) => {
      fs.readFile(this.storagePath, (error: any, data: any) => {
        if (error) {
          return callback(error);
        }

        let newData: any;

        try {
          const content = JSON.parse(data);
          newData = content[this.storageKey] ? content[this.storageKey][key].data : null;
        } catch (e) {
          return callback('Error reading JSON from file');
        }
        callback(null, newData);
      });
    },
    set: (key: any, value: any, callback: any) => {
      fs.readFile(this.storagePath, (readError: any, data: any) => {
        let readData: any;
        if (readError) {
          readData = '{}';
        } else {
          readData = data;
        }
        let content: any = {};
        try {
          content = JSON.parse(readData);
        } catch (error) {
          throw Error(`
            Error reading file ${this.storagePath}
            Error: ${error}
          `);
        }
        content[this.storageKey] = content[this.storageKey] || {};
        content[this.storageKey][key] = { data: value };
        fs.writeFile(this.storagePath, JSON.stringify(content), (writeError: any, data: any) => {
          callback && callback(writeError, content);
        });
      });
    },
  };
}
