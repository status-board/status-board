import * as Chance from 'chance';
import { system } from 'faker';
import logger from '../../../../src/logger';

import * as dashboard from '../../../../src/webapp/routes/dashboard';

import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import * as helpers from '../../../../src/helpers';
import * as itemManager from '../../../../src/item-manager';
import * as templateManager from '../../../../src/template-manager';

jest.mock('../../../../src/logger', () => {
  const errorMock = jest.fn();
  return {
    default: () => ({ error: errorMock }),
    error: errorMock,
  };
});

const chance = new Chance();

describe('Webapp: Dashboard', () => {
  let request: any;
  let response: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();

    jest.spyOn(helpers, 'readJSONFile')
      .mockImplementation((dashboardPath: any, cb: any) => {
        if (dashboardPath.includes('title')) {
          cb(null, { title: 'Dashboard Title' });
        } else if (dashboardPath.includes('error')) {
          cb('ERROR');
        } else if (dashboardPath.includes('mapError')) {
          cb('ERROR');
        } else if (dashboardPath.includes('readError')) {
          cb('ERROR');
        } else if (dashboardPath.includes('multiple')) {
          cb(null, {});
        } else {
          cb(null, {});
        }
      });
    jest.spyOn(itemManager, 'get')
      .mockImplementation((packagesPath: any, itemType: string, extension: string, cb: any) => {
        if (packagesPath.includes('single')) {
          const dashboardConfigFiles = `single/foo/bar`;
          cb(null, [dashboardConfigFiles]);
        } else if (packagesPath.includes('mapError')) {
          const dashboardConfigFiles1 = `mapError/dashboard/one`;
          const dashboardConfigFiles2 = `mapError/dashboard/two`;
          cb(null, [dashboardConfigFiles1, dashboardConfigFiles2]);
        } else if (packagesPath.includes('multiple')) {
          const dashboardConfigFiles1 = `multiple/dashboard/alfa`;
          const dashboardConfigFiles2 = `multiple/dashboard/delta`;
          const dashboardConfigFiles3 = `multiple/dashboard/golf`;
          const dashboardConfigFiles4 = `multiple/dashboard/kilo`;
          const dashboardConfigFiles5 = `multiple/dashboard/sierra`;
          const dashboardConfigFiles6 = `multiple/dashboard/whiskey`;
          const dashboardConfigFiles7 = `multiple/dashboard/zulu`;
          const dashboardConfigFiles = [
            dashboardConfigFiles7,
            dashboardConfigFiles2,
            dashboardConfigFiles5,
            dashboardConfigFiles6,
            dashboardConfigFiles4,
            dashboardConfigFiles3,
            dashboardConfigFiles1,
            dashboardConfigFiles1,
          ];
          cb(null, dashboardConfigFiles);
        } else if (packagesPath.includes('error')) {
          cb('ERROR');
        } else {
          cb(null, {});
        }
      });
    jest.spyOn(itemManager, 'getFirst')
      .mockImplementation((packagesPath: string, safeDashboardName: string, args3, exten, cb) => {
        if (packagesPath.includes('title')) {
          cb(null, packagesPath);
        } else if (packagesPath.includes('readError')) {
          cb(null, packagesPath);
        } else if (packagesPath.includes('error')) {
          cb('ERROR');
        } else if (packagesPath.includes('not-found')) {
          cb(null, null);
        }
      });
    jest.spyOn(templateManager, 'resolveTemplateLocation')
      .mockImplementation((fileName: string, cb: any) => {
        cb(null, 'something');
      });
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
    jest.restoreAllMocks();
  });

  test('getSafeItemName should return the file name without extension', () => {
    const item1 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const fileExt = system.fileExt('text/html');
    const itemName = `/${item1}/${item2}/${item3}/${item4}/${item5}${fileExt}`;

    const safeItemName = dashboard.getSafeItemName(itemName);

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

    dashboard.readDashboardJSON(dashboardPath, (error: any, dashboard: any) => {
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

    dashboard.readDashboardJSON(dashboardPath, (error: any, dashboard: any) => {
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

    dashboard.readDashboardJSON(dashboardPath, (error: any, dashboard: any) => {
      expect(error).toMatch('ERROR');
      expect(logger().error).toHaveBeenCalledWith(`Error reading dashboard: ${dashboardPath}`);
      expect(dashboard).toBeUndefined();
    });
  });

  test('listAllDashboards receives error from get', () => {
    const item1 = 'error';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.listAllDashboards(packagesPath, request, response);

    expect(itemManager.get).toHaveBeenCalled();
    expect(itemManager.get).toHaveBeenCalledWith(packagesPath, 'dashboards', '.json', expect.anything());
    expect(logger().error).toHaveBeenCalled();
    expect(logger().error).toHaveBeenCalledWith('ERROR');
    expect(response.status).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith('Error loading dashboards');
  });

  test('listAllDashboards receives only one dashboard from get', () => {
    const item1 = 'single';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.listAllDashboards(packagesPath, request, response);

    expect(itemManager.get).toHaveBeenCalled();
    expect(itemManager.get).toHaveBeenCalledWith(packagesPath, 'dashboards', '.json', expect.anything());
    expect(response.redirect).toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith('/bar');
  });

  test('listAllDashboards receives multiple dashboard from get readDashboardJSON returns error', () => {
    const item1 = 'mapError';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.listAllDashboards(packagesPath, request, response);

    expect(itemManager.get).toHaveBeenCalled();
    expect(itemManager.get).toHaveBeenCalledWith(packagesPath, 'dashboards', '.json', expect.anything());
    expect(response.status).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith('Error reading dashboards');
  });

  test('listAllDashboards receives multiple dashboard from get and resolveTemplateLocation', () => {
    const item1 = 'multiple';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.listAllDashboards(packagesPath, request, response);

    expect(itemManager.get).toHaveBeenCalled();
    expect(itemManager.get).toHaveBeenCalledWith(packagesPath, 'dashboards', '.json', expect.anything());
    expect(templateManager.resolveTemplateLocation).toHaveBeenCalled();
    expect(templateManager.resolveTemplateLocation).toHaveBeenCalledWith('dashboard-list.ejs', expect.anything());
    expect(response.render).toHaveBeenCalled();
    expect(response.render).toHaveBeenCalledWith('something', {
      dashboards: [
        { dashboardName: 'alfa', friendlyDashboardName: 'alfa' },
        { dashboardName: 'alfa', friendlyDashboardName: 'alfa' },
        { dashboardName: 'delta', friendlyDashboardName: 'delta' },
        { dashboardName: 'golf', friendlyDashboardName: 'golf' },
        { dashboardName: 'kilo', friendlyDashboardName: 'kilo' },
        { dashboardName: 'sierra', friendlyDashboardName: 'sierra' },
        { dashboardName: 'whiskey', friendlyDashboardName: 'whiskey' },
        { dashboardName: 'zulu', friendlyDashboardName: 'zulu' },
      ],
    });
  });

  test('renderDashboard should render specified dashboard', () => {
    const item1 = 'title';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.renderDashboard(packagesPath, 'dashboard', request, response);

    expect(itemManager.getFirst).toHaveBeenCalled();
    expect(itemManager.getFirst)
      .toHaveBeenCalledWith(packagesPath, 'dashboard', 'dashboards', '.json', expect.anything());
    expect(helpers.readJSONFile).toHaveBeenCalled();
    expect(helpers.readJSONFile).toHaveBeenCalledWith(packagesPath, expect.anything());
    expect(templateManager.resolveTemplateLocation).toHaveBeenCalled();
    expect(templateManager.resolveTemplateLocation)
      .toHaveBeenCalledWith('dashboard.ejs', expect.anything());
    expect(response.render).toHaveBeenCalled();
    expect(response.render).toHaveBeenCalledWith('something', {
      dashboardConfig: { title: 'Dashboard Title' },
      dashboardName: 'dashboard',
    });
  });

  test('renderDashboard if getFirst returns a error respond with a 400 and error message', () => {
    const item1 = 'error';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.renderDashboard(packagesPath, 'dashboard', request, response);

    expect(itemManager.getFirst).toHaveBeenCalled();
    expect(itemManager.getFirst)
      .toHaveBeenCalledWith(packagesPath, 'dashboard', 'dashboards', '.json', expect.anything());

    expect(response.status).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith('ERROR');
  });

  test('renderDashboard if getFirst returns a no dashboard path respond with a 404 and error message', () => {
    const item1 = 'not-found';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.renderDashboard(packagesPath, 'dashboard', request, response);

    expect(itemManager.getFirst).toHaveBeenCalled();
    expect(itemManager.getFirst)
      .toHaveBeenCalledWith(packagesPath, 'dashboard', 'dashboards', '.json', expect.anything());

    expect(response.status).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith('\n' +
      '          Trying to render the dashboard \'dashboard\', but couldn\'t find a valid dashboard\n' +
      '          with that name. If the dashboard exists, is it a valid json file? Please check the console\n' +
      '          for error messages.\n' +
      '        ');
  });

  test('renderDashboard if readJSONFile returns a error respond with 400 and error message', () => {
    const item1 = 'readError';
    const item2 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item3 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item4 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const item5 = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const packagesPath = `/${item1}/${item2}/${item3}/${item4}/${item5}`;

    dashboard.renderDashboard(packagesPath, 'dashboard', request, response);

    expect(itemManager.getFirst).toHaveBeenCalled();
    expect(itemManager.getFirst)
      .toHaveBeenCalledWith(packagesPath, 'dashboard', 'dashboards', '.json', expect.anything());
    expect(helpers.readJSONFile).toHaveBeenCalled();
    expect(helpers.readJSONFile).toHaveBeenCalledWith(packagesPath, expect.anything());
    expect(response.status).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalled();
    expect(response.send).toHaveBeenCalledWith('Invalid dashboard config file');
  });

});
