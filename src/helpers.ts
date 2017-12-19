import * as fs from 'fs';

export function readJSONFile(dashboardPath: any, cb: any) {
  fs.readFile(dashboardPath, (error: any, data: any) => {
    if (error) {
      return cb(error);
    }

    try {
      cb(null, JSON.parse(data));
    } catch (error) {
      cb(error);
    }
  });
}

export function noop() {
  // No operation performed.
}
