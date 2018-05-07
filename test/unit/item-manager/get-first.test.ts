import * as Chance from 'chance';
import { getFirst } from '../../../src/item-manager';
import * as get from '../../../src/item-manager/get';
import * as resolveCandidates from '../../../src/item-manager/resolve-candidates';
import { system } from '../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Item Manager: Get First', () => {
  beforeEach(() => {
    jest.spyOn(get, 'get')
      .mockImplementation((path, type, ext, cb) => {
        if (path.includes('GET_THROWS_ERROR')) {
          cb('ERROR');
        } else {
          const items = [chance.filePath()];
          cb(null, items);
        }
      });
    jest.spyOn(resolveCandidates, 'resolveCandidates')
      .mockImplementation((items, name, type, ext) => {
        if (name.includes('RESOLVE_CANDIDATES_RETURNS_NOTHING')) {
          return [];
        } else {
          return ['MOCK_RESOLVE_CANDIDATES_ITEM'];
        }
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return first candidate found matching name, type and extension', () => {
    const packagesPath = [chance.filePath()];
    const itemName = chance.name();
    const itemType = chance.pickone(['dashboards', 'jobs', 'widgets']);
    const extension = chance.fileExt();

    getFirst(packagesPath, itemName, itemType, extension, (error, candidates) => {
      expect(error).toBeNull();
      expect(candidates).toEqual('MOCK_RESOLVE_CANDIDATES_ITEM');
    });
  });

  test('should return error from get', () => {
    const packagesPath = ['GET_THROWS_ERROR'];
    const itemName = chance.name();
    const itemType = chance.pickone(['dashboards', 'jobs', 'widgets']);
    const extension = chance.fileExt();

    getFirst(packagesPath, itemName, itemType, extension, (error, candidates) => {
      expect(error).toEqual('ERROR');
      expect(candidates).toBeUndefined();
    });
  });

  test('should return null if there are no matches', () => {
    const packagesPath = [chance.filePath(),];
    const itemName = 'RESOLVE_CANDIDATES_RETURNS_NOTHING';
    const itemType = chance.pickone(['dashboards', 'jobs', 'widgets']);
    const extension = chance.fileExt();

    getFirst(packagesPath, itemName, itemType, extension, (error, candidates) => {
      expect(error).toBeNull();
      expect(candidates).toBeNull();
    });
  });
});
