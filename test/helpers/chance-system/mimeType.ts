import * as Chance from 'chance';
import mimeTypes from './mime-types';

const chance = new Chance();

/**
 * mimeType
 *
 * @method faker.system.mimeType
 */
export default function (): string {
  return chance.pickone(Object.keys(mimeTypes));
}
