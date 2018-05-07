import * as Chance from 'chance';
import * as fs from 'fs';
import { noop } from '../../../src/helpers';
import * as checkPkdDir from '../../../src/package-dependency-manager/check-packages-folder';
import * as checkVerPkg from '../../../src/package-dependency-manager/check-valid-if-atlasboard-version-for-package';
import * as install from '../../../src/package-dependency-manager/install';
import { installDependencies } from '../../../src/package-dependency-manager';
import { system } from '../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Package Dependency Manager: Install Dependencies', () => {
  beforeEach(() => {
    jest.spyOn(checkPkdDir, 'checkPackagesFolder')
      .mockImplementation(noop);
    jest.spyOn(checkVerPkg, 'checkValidIfAtlasboardVersionForPackage')
      .mockImplementation(noop);
    jest.spyOn(install, 'install')
      .mockImplementation(noop);
    jest.spyOn(fs, 'existsSync')
      .mockImplementation(noop);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('test', () => {
    const packagesPath = [chance.filePath()];
    installDependencies(packagesPath, (error) => {
      expect(error).toBeNull();
    });
  });
});
