import * as Chance from 'chance';
import { Response } from 'jest-express/lib/response';
import { system } from '../../../../helpers/chance-system';

import { loadHTML } from '../../../../../src/webapp/routes/widget';
import * as getFileContents from '../../../../../src/webapp/routes/widget/get-file-contents';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Load HTML', () => {
  let response: Response;
  let code: string;

  beforeEach(() => {
    response = new Response();
    response.write = jest.fn();
    code = '<!doctype html><html><head></head><body></body></html>';
    jest.spyOn(getFileContents, 'getFileContents')
      .mockImplementation((ext, name, path, cb) => {
        if (name === 'RETURN_NO_HTML') {
          cb(null, null);
        } else if (name === 'RETURN_ERROR') {
          cb('GET_FILE_CONTENTS_ERROR');
        } else {
          cb(null, code);
        }
      });
  });

  afterEach(() => {
    response.resetMocked();
    jest.restoreAllMocks();
  });

  test('should get the files content and add wite response', () => {
    const widgetName = chance.name();
    const packagesPath = chance.filePath();
    loadHTML(response, widgetName, packagesPath, (error) => {
      expect(error).toBeNull();
      expect(getFileContents.getFileContents).toHaveBeenCalledWith(
        '.html',
        widgetName,
        packagesPath,
        expect.any(Function),
      );
      expect(response.write).toHaveBeenCalledWith(code);
    });
  });

  test('should return nothing if there is no html and not write a response', () => {
    const widgetName = 'RETURN_NO_HTML';
    const packagesPath = chance.filePath();
    loadHTML(response, widgetName, packagesPath, (error) => {
      expect(error).toBeNull();
      expect(getFileContents.getFileContents).toHaveBeenCalledWith(
        '.html',
        widgetName,
        packagesPath,
        expect.any(Function),
      );
      expect(response.write).not.toHaveBeenCalled();
    });
  });

  test('should return error from get file content and not write a response', () => {
    const widgetName = 'RETURN_ERROR';
    const packagesPath = chance.filePath();
    loadHTML(response, widgetName, packagesPath, (error) => {
      expect(error).toEqual('GET_FILE_CONTENTS_ERROR');
      expect(getFileContents.getFileContents).toHaveBeenCalledWith(
        '.html',
        widgetName,
        packagesPath,
        expect.any(Function),
      );
      expect(response.write).not.toHaveBeenCalled();
    });
  });
});
