import * as Chance from 'chance';
import * as readJson from 'read-package-json';
import { getValidPackageJSON } from '../../../src/package-dependency-manager/get-valid-package-json';
import { IChanceSystem, system } from '../../helpers/chance-system';

jest.mock('read-package-json');

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Package Dependency Manager: Get Valid Package JSON', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call read-package-json with package path and callback', () => {
    const pathPackage = chance.filePath();
    const callback = jest.fn();

    getValidPackageJSON(pathPackage, callback);

    expect(readJson).toHaveBeenCalledWith(`${pathPackage}/package.json`, callback);
  });
});
