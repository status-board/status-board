import * as fs from 'fs';
import ErrnoException = NodeJS.ErrnoException;

export function readJSONFile(dashboardPath: any, cb: any) {
  fs.readFile(dashboardPath, (error: ErrnoException | null, data: Buffer) => {
    if (error) {
      return cb(error);
    }

    try {
      cb(null, JSON.parse(data.toString('utf8')));
    } catch (error) {
      cb(error);
    }
  });
}

export function noop() {
    // No operation performed.
}
