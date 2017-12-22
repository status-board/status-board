import { resolveTemplateLocation } from '../../src/template-manager';
import { checkIfFileExists } from '../../src/utilities';

jest.mock('../../src/utilities/check-if-file-exists.ts', () => {
  return {
    checkIfFileExists: jest.fn((fileName, callback) => {
      if (fileName.includes('DEFAULT')) {
        callback(null, false);
      } else if (fileName.includes('LOCAL')) {
        callback(null, true);
      } else if (fileName.includes('ERROR')) {
        callback(Error('ERROR'));
      }
    }),
  };
});

describe('Template Manager', () => {
  test('Return local wallboard location if exists', () => {
    const filePath = 'LOCAL';

    function callback(error, exists) {
      expect(checkIfFileExists).toHaveBeenCalled();
      expect(checkIfFileExists).toHaveBeenCalledWith(
        expect.stringContaining(filePath),
        expect.anything(),
      );
      expect(error).toBeNull();
      expect(exists).toMatch(filePath);
    }

    return resolveTemplateLocation(filePath, callback);
  });

  test('Return default wallboard location', () => {
    const filePath = 'DEFAULT';

    function callback(error, exists) {
      expect(checkIfFileExists).toHaveBeenCalled();
      expect(checkIfFileExists).toHaveBeenCalledWith(
        expect.stringContaining(filePath),
        expect.anything(),
      );
      expect(error).toBeNull();
      expect(exists).toMatch(filePath);
    }

    return resolveTemplateLocation(filePath, callback);
  });

  test('Return error', () => {
    const filePath = 'ERROR';

    function callback(error, exists) {
      expect(checkIfFileExists).toHaveBeenCalled();
      expect(checkIfFileExists).toHaveBeenCalledWith(
        expect.stringContaining(filePath),
        expect.anything(),
      );
      expect(error).toEqual(Error('ERROR'));
      expect(exists).toBeUndefined();
    }

    return resolveTemplateLocation(filePath, callback);
  });
});
