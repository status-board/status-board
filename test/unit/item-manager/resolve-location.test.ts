import * as Chance from 'chance';
import { resolveLocation } from '../../../src/item-manager';
import { IChanceSystem, system } from '../../helpers/chance-system';

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Item Manager: Resolve Location', () => {
  test('should return path relative to packages path for dashboards', () => {
    const name = chance.name();
    const itemType = 'dashboards';
    const extension = chance.fileExt();
    const expectedLocation = `${itemType}/${name}${extension}`;

    const location = resolveLocation(name, itemType, extension);

    expect(location).toEqual(expectedLocation);
  });

  test('should return path relative to packages path for jobs', () => {
    const name = chance.name();
    const itemType = 'jobs';
    const extension = chance.fileExt();
    const expectedLocation = `${itemType}/${name}/${name}${extension}`;

    const location = resolveLocation(name, itemType, extension);

    expect(location).toEqual(expectedLocation);
  });

  test('should return path relative to packages path for widgets', () => {
    const name = chance.name();
    const itemType = 'widgets';
    const extension = chance.fileExt();
    const expectedLocation = `${itemType}/${name}/${name}${extension}`;

    const location = resolveLocation(name, itemType, extension);

    expect(location).toEqual(expectedLocation);
  });
});
