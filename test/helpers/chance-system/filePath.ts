import directoryPath from './directoryPath';
import fileName from './fileName';

/**
 * returns file path
 *
 * @method chance.system.filePath
 */
export default function (): string {
  return `${directoryPath()}/${fileName()}`;
}
