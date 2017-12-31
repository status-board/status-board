// -------------------------------
// Filesystem storage implementation
// -------------------------------
import * as fs from 'fs';
import * as path from 'path';
import IStorageBase from '../IStorageBase';

export default class StorageFS implements IStorageBase {
  private storageKey: string;
  private options?: any;
  private storagePath: string;

  constructor(storageKey: any, options?: any) {
    this.storageKey = storageKey;
    this.options = options || {};
    this.storagePath = options ? options.storagePath : path.join(process.cwd(), '/job-data-storage.json');
  }

  public get(key: any, callback: any): void {
    fs.readFile(this.storagePath, (error: any, data?: any) => {
      if (error) {
        return callback(error);
      }

      let newData: any;

      try {
        const content = JSON.parse(data);
        newData = content[this.storageKey][key] ? content[this.storageKey][key].data : null;
      } catch (e) {
        return callback('Error reading JSON from file');
      }
      callback(null, newData);
    });
  }

  public set(key: any, value: any, callback: any): void {
    fs.readFile(this.storagePath, (readError: any, data?: any) => {
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
      fs.writeFile(this.storagePath, JSON.stringify(content), (writeError: any) => {
        callback(writeError, content);
      });
    })
    ;
  }
}
