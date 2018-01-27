import * as Chance from 'chance';
import { random, system } from 'faker';

import {
  getSafeItemName,
  readDashboardJSON,
} from '../../../../src/webapp/routes/dashboard';

import {
  Request,
  Response,
} from '../../../helpers/express';

import * as helpers from '../../../../src/helpers';
import * as itemManager from '../../../../src/item-manager';
import * as templateManager from '../../../../src/template-manager';

const chance = new Chance();

describe('Webapp: Dashboard', () => {
  const spyOn: any = {};
  let request: any;
  let response: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();

    spyOn.readJSONFile = jest.spyOn(helpers, 'readJSONFile').mockImplementation((dashboardPath, cb) => {
      if (dashboardPath.includes('title')) {
        cb(null, { title: 'Dashboard Title' });
      } else if (dashboardPath.includes('error')) {
        cb('ERROR');
      } else {
        cb(null, {});
      }
    });
    spyOn.get = jest.spyOn(itemManager, 'get').mockImplementation();
    spyOn.getFirst = jest.spyOn(itemManager, 'getFirst').mockImplementation();
    // spyOn.error = jest.spyOn(logger, 'error').mockImplementation();
    spyOn.resolveTemplateLocation = jest.spyOn(templateManager, 'resolveTemplateLocation').mockImplementation();
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();

    spyOn.readJSONFile.mockRestore();
    spyOn.get.mockRestore();
    // spyOn.error.mockRestore();
    spyOn.getFirst.mockRestore();
    spyOn.resolveTemplateLocation.mockRestore();
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
      expect(dashboard).toBeUndefined();
    });
  });
});
