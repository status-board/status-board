import * as path from 'path';
import { checkIfFileExists } from './utilities';

export type Callback = (error: Error | null, response?: string) => void;

/**
 * Resolve the appropriate template location based on the template name.
 * If the template exists in the wallboard directory, it will return that.
 * Otherwise it will return the default one from the Status Board directory.
 * @param {string} fileName
 * @param {function} callback
 */
export function resolveTemplateLocation(fileName: string, callback: Callback) {
  const localWallboardLocation = path.join(process.cwd(), 'templates', fileName);
  const defaultStatusBoardLocation = path.join(__dirname, '../templates', fileName);
  checkIfFileExists(localWallboardLocation, (error, exists) => {
    if (error) {
      return callback(error);
    }

    if (exists) {
      return callback(null, localWallboardLocation);
    }
    return callback(null, defaultStatusBoardLocation);
  });
}
