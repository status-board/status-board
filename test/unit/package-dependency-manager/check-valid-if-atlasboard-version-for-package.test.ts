import * as Chance from 'chance';
import * as path from 'path';
import {
  checkValidIfAtlasboardVersionForPackage,
} from '../../../src/package-dependency-manager/check-valid-if-atlasboard-version-for-package';
import * as getJson from '../../../src/package-dependency-manager/get-valid-package-json';
import { IChanceSystem, system } from '../../helpers/chance-system';
import { getValidPackageJSON } from "../../../src/package-dependency-manager/get-valid-package-json";

const atlasboardPackageJsonPath = path.join(__dirname, '../../../');

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Package Dependency Manager: Check Valid If Atlasboard Version For Package', () => {
  beforeEach(() => {
    jest.spyOn(getJson, 'getValidPackageJSON').mockImplementation((path, cb) => {
      if (path === '/file') return cb(null, {});
      return cb('ERROR');
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should reading projects package.json throws a error, return error to callback', () => {
    const pathPackage = '/error';
    checkValidIfAtlasboardVersionForPackage(pathPackage, (message) => {
      expect(message).toEqual('ERROR');
    });
  });

  test('should reading atlasboard package.json throws a error, return message', () => {
    const pathPackage = '/file';
    checkValidIfAtlasboardVersionForPackage(pathPackage, (message) => {
      expect(message).toEqual(`package.json not found for atlasboard at ${atlasboardPackageJsonPath}`);
    });
  });

  describe('version mismatch', () => {
    beforeEach(() => {
      getJson.getValidPackageJSON.mockRestore();
      jest.spyOn(getJson, 'getValidPackageJSON').mockImplementation((path, cb) => {
        if (path === '/file') return cb(null, { engines: { atlasboard: '1.0.0' } });
        if (path === atlasboardPackageJsonPath) return cb(null, { version: '1.0.1' });
        return cb('ERROR');
      });
    });

    test('should project require a older version of atlasboard return message', () => {
      const pathPackage = '/file';
      checkValidIfAtlasboardVersionForPackage(pathPackage, (message) => {
        expect(message).toEqual(`
          Atlasboard version does not satisfy package dependencies at ${pathPackage}.
          Please consider updating your version of atlasboard.
          Version required: 1.0.0
          Atlasboard version: 1.0.1
        `);
      });
    });
  });

  describe('matching versions', () => {
    beforeEach(() => {
      getJson.getValidPackageJSON.mockRestore();
      jest.spyOn(getJson, 'getValidPackageJSON').mockImplementation((path, cb) => {
        if (path === '/file') return cb(null, { engines: { atlasboard: '1.0.0' } });
        if (path === atlasboardPackageJsonPath) return cb(null, { version: '1.0.0' });
        return cb('ERROR');
      });
    });

    test('if projects required version matches atlasboard version return null', () => {
      const pathPackage = '/file';
      checkValidIfAtlasboardVersionForPackage(pathPackage, (message) => {
        expect(message).toBeNull();
      });
    });
  });

  describe('no atlasboard reference', () => {
    beforeEach(() => {
      getJson.getValidPackageJSON.mockRestore();
      jest.spyOn(getJson, 'getValidPackageJSON').mockImplementation((path, cb) => {
        if (path === '/file') return cb(null, {});
        if (path === atlasboardPackageJsonPath) return cb(null, {});
        return cb('ERROR');
      });
    });

    test('if package.json has no reference return null', () => {
      const pathPackage = '/file';
      checkValidIfAtlasboardVersionForPackage(pathPackage, (message) => {
        expect(message).toBeNull();
      });
    });
  });
})
;
