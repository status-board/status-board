import * as fs from 'fs';

export type Callback = (error: NodeJS.ErrnoException | null, response?: boolean) => void;

/**
 * @param {string} filePath
 * @param {function} callback
 */
export function checkIfFileExists(filePath: string, callback: Callback) {
  fs.stat(filePath, (error: NodeJS.ErrnoException, stats: fs.Stats) => {
    if (error) {
      if (error.code === 'ENOENT') {
        return callback(null, false);
      }
      return callback(error);
    }
    return callback(null, stats.isFile());
  });
}
