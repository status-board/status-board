// -------------------------------
// Filesystem storage implementation
// -------------------------------
import * as fs from 'fs';
import * as path from 'path';
import logger from '../../../logger';
import StorageBase from '../StorageBase';

export default class StorageFS extends StorageBase {
  private storageKey: string;
  private options: string;
  private storagePath: string;

  constructor(storageKey: any, options: any) {
    super();
    this.storageKey = storageKey;
    this.options = options || {};
    this.storagePath = options.storagePath || path.join(process.cwd(), '/job-data-storage.json');
  }

  public get(key: any, callback: any) {
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
  }

  public set(key: any, value: any, callback: any) {
    fs.readFile(this.storagePath, (readError: any, data: any) => {
      let readData: any;
      if (readError) {
        readData = '{}';
      }
      else {
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
      fs.writeFile(this.storagePath, JSON.stringify(content), (writeError: any) => {
        callback(writeError, content);
      });
    })
    ;
  };
}
