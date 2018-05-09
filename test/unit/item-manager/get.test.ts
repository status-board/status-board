import * as Chance from 'chance';
import { get } from '../../../src/item-manager';
import * as getByPackage from '../../../src/item-manager/get-by-package';
import { IChanceSystem, system } from '../../helpers/chance-system';

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Item Manager: Get', () => {
  beforeEach(() => {
    jest.spyOn(getByPackage, 'getByPackage').mockImplementation((path, type, ext, cb) => {
      if (path.includes('ERROR')) {
        cb('GET_BY_PACKAGE_ERROR');
      } else {
        const results = [
          {
            dir: `${path}/packages/default`,
            items: [],
          },
          {
            dir: `${path}/packages/demo`,
            items: [
              `${path}/packages/demo/${type}/google-calendar/google-calendar${ext}`,
              `${path}/packages/demo/${type}/issue-types/issue-types${ext}`,
              `${path}/packages/demo/${type}/picture-of-the-day/picture-of-the-day${ext}`,
              `${path}/packages/demo/${type}/quotes/quotes${ext}`,
              `${path}/packages/demo/${type}/sales-graph/sales-graph${ext}`,
            ],
          },
        ];
        cb(null, results);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return list of items found', () => {
    const packagesPath = chance.word();
    const itemType = chance.pickone(['dashboards', 'jobs', 'widgets']);
    const extension = chance.fileExt();

    get(packagesPath, itemType, extension, (error, items) => {
      expect(error).toBeNull();
      expect(items).toEqual([
        `${packagesPath}/packages/demo/${itemType}/google-calendar/google-calendar${extension}`,
        `${packagesPath}/packages/demo/${itemType}/issue-types/issue-types${extension}`,
        `${packagesPath}/packages/demo/${itemType}/picture-of-the-day/picture-of-the-day${extension}`,
        `${packagesPath}/packages/demo/${itemType}/quotes/quotes${extension}`,
        `${packagesPath}/packages/demo/${itemType}/sales-graph/sales-graph${extension}`,
      ]);
    });
  });

  test('should return error', () => {
    const packagesPath = 'THROW_ERROR';
    const itemType = chance.pickone(['dashboards', 'jobs', 'widgets']);
    const extension = chance.fileExt();

    get(packagesPath, itemType, extension, (error, items) => {
      expect(error).toEqual('GET_BY_PACKAGE_ERROR');
      expect(items).toBeUndefined();
    });
  });
});
