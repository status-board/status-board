import * as Chance from 'chance';
import * as fs from 'fs';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import * as itemManager from '../../../../../src/item-manager';
import { getFileContents } from '../../../../../src/webapp/routes/widget';
import { system } from '../../../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Get File Contents', () => {
  let request: Request;
  let response: Response;
  let filePath: string;

  beforeEach(() => {
    request = new Request();
    response = new Response();
    filePath = chance.filePath();
    jest.spyOn(fs, 'readFile').mockImplementation((path, options, cb) => cb(null, 'FS_READFILE_DATA'));
    jest.spyOn(itemManager, 'getFirst').mockImplementation((packagesPath, itemName, itemType, extension, cb) => {
      if (itemName === 'NO_PATH') {
        cb(null, undefined);
      } else if (itemName === 'ERROR') {
        cb('GET_FIRST_ERROR', undefined);
      } else {
        cb(null, filePath);
      }
    });
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
    jest.restoreAllMocks();
  });

  test('should fs read the content of the widget file', () => {
    const extension = chance.fileExt();
    const widgetName = chance.name();
    const packagesPath = chance.filePath();

    getFileContents(extension, widgetName, packagesPath, (error, data) => {
      expect(error).toBeNull();
      expect(data).toEqual('FS_READFILE_DATA');
      expect(itemManager.getFirst)
        .toHaveBeenCalledWith(
          packagesPath,
          widgetName,
          'widgets',
          extension,
          expect.any(Function),
        );
      expect(fs.readFile)
        .toHaveBeenCalledWith(
          filePath,
          'utf-8',
          expect.any(Function),
        );
    });
  });

  test('should call the callback with error if there is no path returned by getFirst', () => {
    const extension = chance.fileExt();
    const widgetName = 'NO_PATH';
    const packagesPath = chance.filePath();

    getFileContents(extension, widgetName, packagesPath, (error, data) => {
      expect(error).toEqual('File does not exist');
      expect(data).toBeUndefined();
      expect(itemManager.getFirst)
        .toHaveBeenCalledWith(
          packagesPath,
          widgetName,
          'widgets',
          extension,
          expect.any(Function),
        );
      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });

  test('should call the callback with error if getFirst returns error', () => {
    const extension = chance.fileExt();
    const widgetName = 'ERROR';
    const packagesPath = chance.filePath();

    getFileContents(extension, widgetName, packagesPath, (error, data) => {
      expect(error).toEqual('GET_FIRST_ERROR');
      expect(data).toBeUndefined();
      expect(itemManager.getFirst)
        .toHaveBeenCalledWith(
          packagesPath,
          widgetName,
          'widgets',
          extension,
          expect.any(Function),
        );
      expect(fs.readFile).not.toHaveBeenCalled();
    });
  });
});
