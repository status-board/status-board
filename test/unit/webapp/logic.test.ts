import * as fs from 'fs';
import { Response } from 'jest-express/lib/response';
import * as path from 'path';
import * as helpers from '../../../src/helpers';
import * as itemManager from '../../../src/item-manager';
import { logger } from '../../../src/logger';
import {
  getSafeItemName,
  log,
  renderJsDashboard,
} from '../../../src/webapp/logic';

describe('Webapp: Logic', () => {
  let response: any;
  let request: any;

  beforeEach(() => {
    response = new Response();
    response.write = jest.fn();
    request = jest.fn();
    jest.spyOn(logger, 'error');
    jest.spyOn(itemManager, 'getFirst')
    // tslint:disable-next-line max-line-length
      .mockImplementation((packagesPath: string, safeDashboardName: string, dashboards: string, json: string, callback: any) => {
        if (packagesPath === 'NO_DASHBOARD_PATH') {
          callback();
        } else if (packagesPath === 'JSON_FILE_ERROR') {
          callback(null, packagesPath);
        } else if (packagesPath === 'JSON_FILE') {
          callback(null, packagesPath);
        } else if (packagesPath === 'READ_FILE_ERROR') {
          callback(null, packagesPath);
        } else if (packagesPath === 'NO_CUSTOM_JS') {
          callback(null, packagesPath);
        } else if (packagesPath === 'ERROR') {
          callback('ERROR');
        }
      });
    jest.spyOn(helpers, 'readJSONFile')
      .mockImplementation((dashboardPath: string, callback: any) => {
        if (dashboardPath === 'JSON_FILE') {
          callback(null, { layout: { customJS: ['custom.js'] } });
        } else if (dashboardPath === 'READ_FILE_ERROR') {
          callback(null, { layout: { customJS: ['error.js'] } });
        } else if (dashboardPath === 'NO_CUSTOM_JS') {
          callback(null, { layout: {} });
        } else if (dashboardPath === 'JSON_FILE_ERROR') {
          callback('ERROR');
        }
      });
    jest.spyOn(path, 'join')
      .mockImplementation((arg1: string, arg2: string, arg3: string, arg4: string) => {
        if (arg4) {
          return `/path/to/${arg3}/${arg4}`;
        }
        if (arg2 === '/javascripts/') {
          return `${arg1}${arg2}${arg3}`;
        }
        return `${arg1}/${arg2}/${arg3}`;
      });
    jest.spyOn(fs, 'readFile')
      .mockImplementation((assetFullPath: string, callback: any) => {
        if (assetFullPath.includes('custom.js')) {
          callback(null, 'Hello World!');
        } else if (assetFullPath.includes('error.js')) {
          callback('ERROR');
        }
      });
  });

  afterEach(() => {
    response.resetMocked();

    logger.error.mockRestore();
    itemManager.getFirst.mockRestore();
    helpers.readJSONFile.mockRestore();
    path.join.mockRestore();
    fs.readFile.mockRestore();
  });

  test('Should render log template', () => {
    log(request, response);

    expect(response.render).toBeCalled();
    expect(response.render).toBeCalledWith('/path/to/templates/dashboard-log.ejs');
  });

  test('getFirst returns a error', () => {
    renderJsDashboard('ERROR', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst).toBeCalledWith('ERROR', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.status).toBeCalled();
    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalled();
    expect(response.send).toBeCalledWith('ERROR');
  });

  test('getFirst returns no dashboardPath', () => {
    renderJsDashboard('NO_DASHBOARD_PATH', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('NO_DASHBOARD_PATH', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.status).toBeCalled();
    expect(response.status).toBeCalledWith(404);
    expect(response.send).toBeCalled();
    expect(response.send)
    // tslint:disable-next-line max-line-length
      .toBeCalledWith('Trying to render dashboard dashboardName, but couldn\'t find any dashboard in the packages folder');
  });

  test('readJSONFile returns a error', () => {
    renderJsDashboard('JSON_FILE_ERROR', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('JSON_FILE_ERROR', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.status).toBeCalled();
    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalled();
    expect(response.send).toBeCalledWith('Error reading dashboard');
  });

  test('readJSONFile returns dashboardJSON', () => {
    renderJsDashboard('JSON_FILE', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst).toBeCalledWith('JSON_FILE', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.type).toBeCalled();
    expect(response.type).toBeCalledWith('application/javascript');
    expect(fs.readFile).toBeCalled();
    expect(fs.readFile).toBeCalledWith('wallboardAssetsFolder/javascripts/custom.js', expect.anything());

    expect(response.write).toBeCalled();
    expect(response.write).toBeCalledWith('Hello World!\n\n');
    expect(response.end).toBeCalled();
  });

  test('fs.readFile returns error', () => {
    renderJsDashboard('READ_FILE_ERROR', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('READ_FILE_ERROR', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.type).toBeCalled();
    expect(response.type).toBeCalledWith('application/javascript');
    expect(fs.readFile).toBeCalled();
    expect(fs.readFile).toBeCalledWith('wallboardAssetsFolder/javascripts/error.js', expect.anything());
    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledWith('wallboardAssetsFolder/javascripts/error.js not found');
    expect(response.end).toBeCalled();
  });

  test('No custom js', () => {
    renderJsDashboard('NO_CUSTOM_JS', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('NO_CUSTOM_JS', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.type).toBeCalled();
    expect(response.type).toBeCalledWith('application/javascript');
    expect(response.end).toBeCalled();
  });

  test('Should return the filename without ext', () => {
    const safeItem = getSafeItemName('/foo/bar/baz/asdf/filename.js');
    expect(safeItem).toEqual('filename');
  });
});
