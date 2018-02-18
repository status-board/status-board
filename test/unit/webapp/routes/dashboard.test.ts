import * as Chance from 'chance';
import { random, system } from 'faker';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { noop } from '../../../../src/helpers';
import { logger } from '../../../../src/logger';

import * as helpers from '../../../../src/helpers';
import * as itemManager from '../../../../src/item-manager';
import * as templateManager from '../../../../src/template-manager';
import {
  getSafeItemName,
  listAllDashboards,
  readDashboardJSON,
} from '../../../../src/webapp/routes/dashboard';

const chance = new Chance();

describe('Webapp: Dashboard', () => {
  let request: any;
  let response: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();
    jest.spyOn(helpers, 'readJSONFile').mockImplementation((dashboardPath, cb) => {
      if (dashboardPath.includes('title')) {
        cb(null, { title: 'Dashboard Title' });
      } else if (dashboardPath.includes('error')) {
        cb('ERROR');
      } else {
        cb(null, {});
      }
    });
    jest.spyOn(itemManager, 'get').mockImplementation();
    jest.spyOn(itemManager, 'getFirst').mockImplementation();
    jest.spyOn(logger, 'error').mockImplementation(noop);
    jest.spyOn(templateManager, 'resolveTemplateLocation').mockImplementation();
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();

    helpers.readJSONFile.mockRestore();
    itemManager.get.mockRestore();
    logger.error.mockRestore();
    itemManager.getFirst.mockRestore();
    templateManager.resolveTemplateLocation.mockRestore();
  });

  test('getSafeItemName should return the file name without extension', () => {
    const item1 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const fileExt = system.fileExt('text/html');
    const itemName = `/${item1}/${item2}/${item3}/${item4}/${item5}${fileExt}`;

    const safeItemName = getSafeItemName(itemName);

    expect(safeItemName).toMatch(item5);
  });

  test('readDashboardJSON without title in dashboard file', () => {
    const item1 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const fileExt = '.json';
    const dashboardPath = `/${item1}/${item2}/${item3}-${item4}_${item5}${fileExt}`;

    readDashboardJSON(dashboardPath, (error: any, dashboard: any) => {
      expect(error).toBeNull();
      expect(dashboard).toEqual({
        dashboardName: `${item3}-${item4}_${item5}`,
        friendlyDashboardName: `${item3} ${item4} ${item5}`,
      });
    });
  });

  test('readDashboardJSON with title in dashboard file', () => {
    const item1 = 'title';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const fileExt = '.json';
    const dashboardPath = `/${item1}/${item2}/${item3}-${item4}_${item5}${fileExt}`;

    readDashboardJSON(dashboardPath, (error: any, dashboard: any) => {
      expect(error).toBeNull();
      expect(dashboard).toEqual({
        dashboardName: `${item3}-${item4}_${item5}`,
        friendlyDashboardName: 'Dashboard Title',
        title: 'Dashboard Title',
      });
    });
  });

  test('readDashboardJSON with error', () => {
    const item1 = 'error';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const fileExt = '.json';
    const dashboardPath = `/${item1}/${item2}/${item3}-${item4}_${item5}${fileExt}`;

    readDashboardJSON(dashboardPath, (error: any, dashboard: any) => {
      expect(error).toMatch('ERROR');
      expect(logger.error).toHaveBeenCalledWith(`Error reading dashboard: ${dashboardPath}`);
      expect(dashboard).toBeUndefined();
    });
  });

  test('listAllDashboards', () => {
    const item1 = 'error';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    listAllDashboards(packagesPath, request, response);

    expect(itemManager.get).toHaveBeenCalled();
    expect(itemManager.get).toHaveBeenCalledWith(packagesPath, 'dashboards', '.json', expect.anything());
  });
});
