import * as fs from 'fs';
import * as path from 'path';
import * as helpers from '../../../src/helpers';
import * as itemManager from '../../../src/item-manager';
import { logger } from '../../../src/logger';
import {
  getSafeItemName,
  log,
  renderJsDashboard,
} from '../../../src/webapp/logic';
import { MockedResponse } from '../../helpers/express/response';

describe('Test', () => {
  const spyOn: any = {};
  let response: any;
  let request: any;

  beforeEach(() => {
    response = new MockedResponse();
    request = jest.fn();
    spyOn.error = jest.spyOn(logger, 'error').mockImplementation();
    spyOn.getFirst = jest.spyOn(itemManager, 'getFirst')
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

    spyOn.readJSONFile = jest.spyOn(helpers, 'readJSONFile')
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

    spyOn.join = jest.spyOn(path, 'join')
      .mockImplementation((arg1: string, arg2: string, arg3: string, arg4: string) => {
        if (arg4) {
          return `/path/to/${arg3}/${arg4}`;
        }
        if (arg2 === '/javascripts/') {
          return `${arg1}${arg2}${arg3}`;
        }
        return `${arg1}/${arg2}/${arg3}`;
      });

    spyOn.readFile = jest.spyOn(fs, 'readFile')
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
    spyOn.join.mockRestore();
    spyOn.getFirst.mockRestore();
    spyOn.readJSONFile.mockRestore();
    spyOn.error.mockRestore();
  });

  test('Should render log template', () => {
    log(request, response);

    expect(response.mockedRender).toBeCalled();
    expect(response.mockedRender).toBeCalledWith('/path/to/templates/dashboard-log.ejs');
  });

  test('getFirst returns a error', () => {
    renderJsDashboard('ERROR', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst).toBeCalledWith('ERROR', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.mockedStatus).toBeCalled();
    expect(response.mockedStatus).toBeCalledWith(400);
    expect(response.mockedSend).toBeCalled();
    expect(response.mockedSend).toBeCalledWith('ERROR');
  });

  test('getFirst returns no dashboardPath', () => {
    renderJsDashboard('NO_DASHBOARD_PATH', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('NO_DASHBOARD_PATH', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.mockedStatus).toBeCalled();
    expect(response.mockedStatus).toBeCalledWith(404);
    expect(response.mockedSend).toBeCalled();
    expect(response.mockedSend)
    // tslint:disable-next-line max-line-length
      .toBeCalledWith('Trying to render dashboard dashboardName, but couldn\'t find any dashboard in the packages folder');
  });

  test('readJSONFile returns a error', () => {
    renderJsDashboard('JSON_FILE_ERROR', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('JSON_FILE_ERROR', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.mockedStatus).toBeCalled();
    expect(response.mockedStatus).toBeCalledWith(400);
    expect(response.mockedSend).toBeCalled();
    expect(response.mockedSend).toBeCalledWith('Error reading dashboard');
  });

  test('readJSONFile returns dashboardJSON', () => {
    renderJsDashboard('JSON_FILE', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst).toBeCalledWith('JSON_FILE', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.mockedType).toBeCalled();
    expect(response.mockedType).toBeCalledWith('application/javascript');
    expect(fs.readFile).toBeCalled();
    expect(fs.readFile).toBeCalledWith('wallboardAssetsFolder/javascripts/custom.js', expect.anything());

    expect(response.mockedWrite).toBeCalled();
    expect(response.mockedWrite).toBeCalledWith('Hello World!\n\n');
    expect(response.mockedEnd).toBeCalled();
  });

  test('fs.readFile returns error', () => {
    renderJsDashboard('READ_FILE_ERROR', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('READ_FILE_ERROR', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.mockedType).toBeCalled();
    expect(response.mockedType).toBeCalledWith('application/javascript');
    expect(fs.readFile).toBeCalled();
    expect(fs.readFile).toBeCalledWith('wallboardAssetsFolder/javascripts/error.js', expect.anything());
    expect(logger.error).toBeCalled();
    expect(logger.error).toBeCalledWith('wallboardAssetsFolder/javascripts/error.js not found');
    expect(response.mockedEnd).toBeCalled();
  });

  test('No custom js', () => {
    renderJsDashboard('NO_CUSTOM_JS', 'wallboardAssetsFolder', 'dashboardName', request, response);

    expect(itemManager.getFirst).toBeCalled();
    expect(itemManager.getFirst)
      .toBeCalledWith('NO_CUSTOM_JS', 'dashboardName', 'dashboards', '.json', expect.anything());
    expect(response.mockedType).toBeCalled();
    expect(response.mockedType).toBeCalledWith('application/javascript');
    expect(response.mockedEnd).toBeCalled();
  });

  test('Should return the filename without ext', () => {
    const safeItem = getSafeItemName('/foo/bar/baz/asdf/filename.js');
    expect(safeItem).toEqual('filename');
  });
});
