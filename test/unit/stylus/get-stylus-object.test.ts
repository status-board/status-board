import * as bug from 'debug';
import * as fs from 'fs';
import * as stylus from 'stylus';
import * as configManager from '../../../src/config-manager';
import * as pathResolver from '../../../src/path-resolver';

jest.mock('debug', () => jest.fn());

jest.mock('stylus', () => jest.fn(() => {
  return { import: jest.fn() };
}));

describe('Stylus: Get Stylus Object', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'existsSync')
      .mockImplementation(() => {
      });
    jest.spyOn(pathResolver, 'fromAtlasboard')
      .mockImplementation(() => {
      });
    jest.spyOn(pathResolver, 'fromLocalWallboard')
      .mockImplementation(() => {
      });
    jest.spyOn(configManager, 'configManager')
      .mockImplementation(() => {
        return { theme: 'bar' };
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should match snapshot', () => {
    const getStylusObject = require('../../../src/stylus/get-stylus-object').getStylusObject;
    getStylusObject('');
  });
});
