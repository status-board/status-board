import * as Chance from 'chance';
import * as fs from 'fs';

const chance = new Chance();

jest.mock('fs');

describe('Utilities: checkIfFileExists', () => {
  test('Should return false if file doesn\'t exist', () => {
    require('fs').__setIsFileResponse('ENOENT');
    const checkIfFileExists = require('../../../src/utilities/check-if-file-exists').checkIfFileExists;
    const filePath = chance.string();

    function callback(error, exists) {
      expect(fs.stat).toHaveBeenCalled();
      expect(fs.stat).toHaveBeenCalledWith(filePath, expect.anything());
      expect(exists).toBe(false);
    }

    checkIfFileExists(filePath, callback);
  });

  test('Should return true if file does exist', () => {
    require('fs').__setIsFileResponse(true);
    const checkIfFileExists = require('../../../src/utilities/check-if-file-exists').checkIfFileExists;
    const filePath = chance.string();

    function callback(error, exists) {
      expect(fs.stat).toHaveBeenCalled();
      expect(fs.stat).toHaveBeenCalledWith(filePath, expect.anything());
      expect(exists).toBe(true);
    }

    checkIfFileExists(filePath, callback);
  });

  test('Should return fs.stat error', () => {
    require('fs').__setIsFileResponse('ERROR');
    const checkIfFileExists = require('../../../src/utilities/check-if-file-exists').checkIfFileExists;
    const filePath = chance.string();

    function callback(error) {
      expect(error).toEqual(Error('ERROR'));
    }

    checkIfFileExists(filePath, callback);
  });
});
