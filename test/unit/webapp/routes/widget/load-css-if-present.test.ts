import * as Chance from 'chance';
import { Response } from 'jest-express/lib/response';
import { system } from '../../../../helpers/chance-system';
import { noop } from '../../../../../src/helpers';
import { loadCSSIfPresent } from '../../../../../src/webapp/routes/widget';
import * as addNamespacesCSSToResponse from '../../../../../src/webapp/routes/widget/add-namespaces-css-to-response';
import * as getFileContents from '../../../../../src/webapp/routes/widget/get-file-contents';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Load CSS If Present', () => {
  let response: Response;
  let code: string;

  beforeEach(() => {
    response = new Response();
    code = `div{ background-color:${chance.color({ format: 'hex' })} }`;
    jest.spyOn(getFileContents, 'getFileContents')
      .mockImplementation((ext, name, path, cb) => {
        if (name === 'RETURN_NO_CSS') {
          cb(null, null);
        } else if (name === 'RETURN_ERROR') {
          cb('GET_FILE_CONTENTS_ERROR');
        } else {
          cb(null, code);
        }
      });
    jest.spyOn(addNamespacesCSSToResponse, 'addNamespacesCSSToResponse')
      .mockImplementation(noop);
  });

  afterEach(() => {
    response.resetMocked();
  });

  test('should get the files content and add it to the namespace', () => {
    const widgetName = chance.name();
    const packagesPath = chance.filePath();
    loadCSSIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toBeNull();
      expect(getFileContents.getFileContents)
        .toHaveBeenCalledWith(
          '.css',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse)
        .toHaveBeenCalledWith(
          code,
          widgetName,
          response,
        );
    });
  });

  test('should return nothing if there is no css', () => {
    const widgetName = 'RETURN_NO_CSS';
    const packagesPath = chance.filePath();
    loadCSSIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toBeNull();
      expect(getFileContents.getFileContents)
        .toHaveBeenCalledWith(
          '.css',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse)
        .not.toHaveBeenCalled();
    });
  });

  test('should return error from get file content', () => {
    const widgetName = 'RETURN_ERROR';
    const packagesPath = chance.filePath();
    loadCSSIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toEqual('GET_FILE_CONTENTS_ERROR');
      expect(getFileContents.getFileContents)
        .toHaveBeenCalledWith(
          '.css',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse)
        .not.toHaveBeenCalled();

    });
  });
});
