import * as Chance from 'chance';

const chance = new Chance();

/**
 * returns a commonly used file type
 *
 * @method faker.system.commonFileType
 */
export default function (): string {
  const types = ['video', 'audio', 'image', 'text', 'application'];
  return chance.pickone(types);
}
