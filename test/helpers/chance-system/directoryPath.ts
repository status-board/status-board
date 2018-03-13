import * as Chance from 'chance';
import directoryPaths from './directory-paths';

const chance = new Chance();

/**
 * returns directory path
 *
 * @method chance.system.directoryPath
 */
export default function (): string {
  return chance.pickone(directoryPaths);
}
