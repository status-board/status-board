// -------------------------------
// Filesystem storage implementation
// -------------------------------
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

export default function storageFS(storageKey: any, options: any) {
  this.storageKey = storageKey;
  this.options = options || {};
  this.storagePath = options.storagePath || path.join(process.cwd(), '/job-data-storage.json');
}

util.inherits(storageFS, require('../storage-base'));

storageFS.prototype.get = function (key: any, callback: any) {
  const self = this;
  fs.readFile(self.storagePath, (err: any, data: any) => {
    if (err) {
      return callback(err);
    }
    let data;
    try {
      const content = JSON.parse(data);
      data = content[self.storageKey] ? content[self.storageKey][key].data : null;
    } catch (e) {
      return callback('Error reading JSON from file');
    }
    callback(null, data);
  });
};

storageFS.prototype.set = function (key: any, value: any, callback: any) {
  const self = this;
  fs.readFile(self.storagePath, (err: any, data: any) => {
    if (err) {
      data = "{}";
    } //new file
    let content = {};
    try {
      content = JSON.parse(data);
    } catch (e) {
      console.log('error reading file ' + self.storagePath);
    }
    content[self.storageKey] = content[self.storageKey] || {};
    content[self.storageKey][key] = { data: value };
    fs.writeFile(self.storagePath, JSON.stringify(content), (err: any, data: any) => {
      callback && callback(err, content);
    });
  });
};
