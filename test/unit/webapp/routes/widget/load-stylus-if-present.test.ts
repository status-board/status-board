import * as Chance from 'chance';
import { Response } from 'jest-express/lib/response';
import { noop } from '../../../../../src/helpers';
import { logger } from '../../../../../src/logger';
import { stylus } from '../../../../../src/stylus';
import { loadStylusIfPresent } from '../../../../../src/webapp/routes/widget';
import * as addNamespacesCSSToResponse from '../../../../../src/webapp/routes/widget/add-namespaces-css-to-response';
import * as getFileContents from '../../../../../src/webapp/routes/widget/get-file-contents';
import { system } from '../../../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Load Stylus If Present', () => {
  let response: any;
  let code: string;

  beforeEach(() => {
    response = new Response();
    code = `$background-color = ${chance.color({ format: 'hex' })}`;
    jest.spyOn(getFileContents, 'getFileContents')
      .mockImplementation((ext, name, path, cb) => {
        if (name === 'RETURN_NO_STYL') {
          cb(null, null);
        } else if (name === 'RETURN_ERROR') {
          cb('GET_FILE_CONTENTS_ERROR');
        } else if (name === 'STYLUS_RETURN_ERROR') {
          cb(null, name);
        } else {
          cb(null, code);
        }
      });
    jest.spyOn(stylus, 'getWidgetCSS').mockImplementation((stylusContent, cb) => {
      if (stylusContent === 'STYLUS_RETURN_ERROR') {
        cb('STYLUS_ERROR');
      } else if (stylusContent === '') {
        cb(null, '');
      } else {
        cb(null, '');
      }
    });
    jest.spyOn(addNamespacesCSSToResponse, 'addNamespacesCSSToResponse').mockImplementation(noop);
    jest.spyOn(logger, 'error').mockImplementation(noop);
  });

  afterEach(() => {
    response.resetMocked();
    jest.restoreAllMocks();
  });

  test('should get the files content and add it to the namespace', () => {
    const widgetName = chance.name();
    const packagesPath = chance.system.filePath();
    loadStylusIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toBeNull();
      expect(getFileContents.getFileContents)
        .toBeCalledWith(
          '.styl',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(stylus.getWidgetCSS)
        .toBeCalledWith(
          code,
          expect.any(Function),
        );
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse).toBeCalled();
      expect(logger.error).not.toBeCalled();
    });
  });

  test('should return error from get file content', () => {
    const widgetName = 'RETURN_ERROR';
    const packagesPath = chance.system.filePath();
    loadStylusIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toEqual('GET_FILE_CONTENTS_ERROR');
      expect(getFileContents.getFileContents)
        .toBeCalledWith(
          '.styl',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(stylus.getWidgetCSS).not.toBeCalled();
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse).not.toBeCalled();
      expect(logger.error).not.toBeCalled();
    });
  });

  test('should return nothing if there is no css', () => {
    const widgetName = 'RETURN_NO_STYL';
    const packagesPath = chance.system.filePath();
    loadStylusIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toBeNull();
      expect(getFileContents.getFileContents)
        .toBeCalledWith(
          '.styl',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(stylus.getWidgetCSS).not.toBeCalled();
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse).not.toBeCalled();
      expect(logger.error).not.toBeCalled();
    });
  });

  test('should return error if is a stylus error', () => {
    const widgetName = 'STYLUS_RETURN_ERROR';
    const packagesPath = chance.system.filePath();
    loadStylusIfPresent(response, widgetName, packagesPath, (error) => {
      expect(error).toEqual('STYLUS_ERROR');
      expect(getFileContents.getFileContents)
        .toBeCalledWith(
          '.styl',
          widgetName,
          packagesPath,
          expect.any(Function),
        );
      expect(stylus.getWidgetCSS)
        .toBeCalledWith(
          'STYLUS_RETURN_ERROR',
          expect.any(Function),
        );
      expect(addNamespacesCSSToResponse.addNamespacesCSSToResponse).not.toBeCalled();
      expect(logger.error).toBeCalledWith('STYLUS_ERROR');
    });
  });
});
