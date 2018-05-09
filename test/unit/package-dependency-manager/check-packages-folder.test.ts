import * as Chance from 'chance';
import * as fs from 'fs';
import { checkPackagesFolder } from '../../../src/package-dependency-manager/check-packages-folder';
import { IChanceSystem, system } from '../../helpers/chance-system';

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Package Dependency Manager: Check Packages Folder', () => {

  beforeEach(() => {
    jest.spyOn(fs, 'readdir').mockImplementation((path, cb) => {
      if (path === '/package/folder/') return cb(null, ['item1', 'item2', 'item3']);
      cb('ERROR');
    });
    jest.spyOn(fs, 'statSync').mockImplementation((path) => {
      if (path === '/package/folder/item2') return { isDirectory: () => true };
      if (path === '/package/folder/item3') return { isDirectory: () => true };
      return { isDirectory: () => false };
    });
    jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
      return path === '/package/folder/item2/package.json';
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return error from fs.raddir', () => {
    const packagesPath = '/error';
    checkPackagesFolder(packagesPath, (error, results) => {
      expect(error).toEqual('ERROR');
      expect(results).toBeUndefined();
    });
  });

  test('should return our the directory with a package.json', () => {
    const packagesPath = '/package/folder/';
    checkPackagesFolder(packagesPath, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(['/package/folder/item2']);
    });
  });
});
