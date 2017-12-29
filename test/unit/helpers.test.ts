import {noop, readJSONFile} from '../../src/helpers';

jest.mock('fs');

describe('Helpers', () => {
  test('Should read file', () => {
    function callback(error, data) {
      expect(error).toBeNull();
      expect(data).toMatchObject({ name: 'dashboard' });
    }
    return readJSONFile('/valid_path', callback);
  });

  test('Should return syntax error for invalid content', () => {
    function callback(error, data) {
      expect(error).toEqual(SyntaxError('Unexpected token i in JSON at position 0'));
      expect(data).toBeUndefined();
    }
    return readJSONFile('/invalid_content', callback);
  });

  test('Should return error', () => {
    function callback(error, data) {
      expect(error).toEqual(Error('ERROR'));
      expect(data).toBeUndefined();
    }
    return readJSONFile('/error_path', callback);
  });

  test('Should define noop', () => {
    expect(noop).toBeDefined();
    expect(noop()).toBeUndefined();
  });
});
