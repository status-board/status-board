import * as Chance from 'chance';
import * as fs from 'fs';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { system } from '../../../../helpers/chance-system';

import { renderWidgetResource } from '../../../../../src/webapp/routes/widget';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Render Widget Resource', () => {
  let request: Request;
  let response: Response;

  beforeEach(() => {
    request = new Request();
    response = new Response();
    jest.spyOn(fs, 'existsSync')
      .mockImplementation(path => path.includes('SEND_FILE'));
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
    jest.restoreAllMocks();
  });

  test('if resource id is not specified should return error', () => {
    const localPackagesPath = chance.filePath();
    const resource = null;

    renderWidgetResource(localPackagesPath, resource, request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith('resource id not specified');
    expect(response.sendFile).not.toHaveBeenCalled();
  });

  test('if resource string is incorrectly formed should return error ', () => {
    const localPackagesPath = chance.filePath();
    const resource = `///`;

    renderWidgetResource(localPackagesPath, resource, request, response);

    expect(response.status).toBeCalledWith(400);
    expect(response.send).toBeCalledWith('bad input');
    expect(response.sendFile).not.toHaveBeenCalled();
  });

  test('if resource files exist should send file', () => {
    const localPackagesPath = chance.filePath();
    const packageName = chance.word();
    const widgetName = 'SEND_FILE';
    const resourceName = chance.fileName();
    const resource = `${packageName}/${widgetName}/${resourceName}`;
    const expectedPath = `${localPackagesPath}/${packageName}/widgets/${widgetName}/${resourceName}`;

    renderWidgetResource(localPackagesPath, resource, request, response);

    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
    expect(response.sendFile).toBeCalledWith(expectedPath);
  });

  test('if resource files doesnt exist should send error', () => {
    const localPackagesPath = chance.filePath();
    const packageName = chance.word();
    const widgetName = chance.word();
    const resourceName = chance.fileName();
    const resource = `${packageName}/${widgetName}/${resourceName}`;

    renderWidgetResource(localPackagesPath, resource, request, response);

    expect(response.status).toBeCalledWith(404);
    expect(response.send).toBeCalledWith('resource not found');
    expect(response.sendFile).not.toHaveBeenCalled();
  });
});