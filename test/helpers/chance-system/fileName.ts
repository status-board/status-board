import * as Chance from 'chance';
import fileExt from './fileExt';

const chance = new Chance();

/**
 * commonFileName
 *
 * @method chance.system.fileName
 * @param {string} ext
 */
export default function (ext?: string): string {
  return `${chance.word()}.${ext ? ext : fileExt()}`;
}
