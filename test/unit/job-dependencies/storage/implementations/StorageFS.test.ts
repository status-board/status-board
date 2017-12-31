import * as fs from 'fs';
import * as path from 'path';
import { noop } from '../../../../../src/helpers';
import StorageFS from '../../../../../src/job-dependencies/storage/implementations/StorageFS';

describe('Job Dependencies: StorageFS', () => {
  const spy: any = {};

  beforeEach(() => {
    spy.readFile = jest.spyOn(fs, 'readFile').mockImplementation((storagePath: string, callback: any) => {
      if (storagePath === 'src/error') {
        callback('ERROR');
      } else if (storagePath === 'src/json/error') {
        callback(null, {});
      } else if (storagePath === '/path/to/job-data-storage.json') {
        callback(null, JSON.stringify({ abc: { 123: { data: 'Good Morning!' } } }));
      } else {
        callback(null, JSON.stringify({ foo: { bar: { data: 'Hello World!' } } }));
      }
    });
    spy.writeFile = jest.spyOn(fs, 'writeFile').mockImplementation((storagePath: string, content: string, callback: any) => {
      callback(null, {});
    });
    spy.join = jest.spyOn(path, 'join').mockImplementation(() => '/path/to/job-data-storage.json');
  })
  ;

  afterEach(() => {
    spy.readFile.mockRestore();
    spy.writeFile.mockRestore();
    spy.join.mockRestore();
  });

  test('StorageFS passed no options', () => {
    const storage = new StorageFS('abc');
    storage.get('123', (error: any, content: any) => {
      expect(fs.readFile).toBeCalled();
      expect(fs.readFile).toBeCalledWith('/path/to/job-data-storage.json', expect.anything());
      expect(error).toBeNull();
      expect(content).toEqual('Good Morning!');
    });
  });

  describe('get', () => {
    test('should read data from file and return data with matchingkey', () => {
      const storage = new StorageFS('foo', { storagePath: 'src/local' });
      storage.get('bar', (error: any, content: any) => {
        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith('src/local', expect.anything());
        expect(error).toBeNull();
        expect(content).toEqual('Hello World!');
      });
    });

    test('should return error from fs.readFile', () => {
      const storage = new StorageFS('foo', { storagePath: 'src/error' });
      storage.get('bar', (error: any, content: any) => {
        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith('src/error', expect.anything());
        expect(error).toEqual('ERROR');
        expect(content).toBeUndefined();
      });
    });

    test('should read data from file and return null since the key doesn\'t match existing keys', () => {
      const storage = new StorageFS('foo', { storagePath: 'src/local' });
      storage.get('abc', (error: any, content: any) => {
        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith('src/local', expect.anything());
        expect(error).toBeNull();
        expect(content).toBeNull();
      });
    });

    test('should read data from file and returns error from data that can not json parse', () => {
      const storage = new StorageFS('storageKey', { storagePath: 'src/json/error' });
      storage.get('key', (error: any, content: any) => {
        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith('src/json/error', expect.anything());
        expect(error).toEqual('Error reading JSON from file');
        expect(content).toBeUndefined();
      });
    });
  });

  describe('set', () => {
    test('should read data from file, add new data and write all data to file and return data', () => {
      const storage = new StorageFS('foo', { storagePath: 'src/local' });
      storage.set('abc', '123', (error: any, content: any) => {
        expect(error).toBeNull();
        expect(content).toEqual({ foo: { abc: { data: '123' }, bar: { data: 'Hello World!' } } });
        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith('src/local', expect.anything());
        expect(fs.writeFile).toBeCalled();
        expect(fs.writeFile).toBeCalledWith('src/local', '{"foo":{"bar":{"data":"Hello World!"},"abc":{"data":"123"}}}', expect.anything());
      });
    });

    test('should fs.readFile returns a error start with a empty object string', () => {
      const storage = new StorageFS('foo', { storagePath: 'src/error' });
      storage.set('abc', '123', (error: any, content: any) => {
        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith('src/error', expect.anything());
        expect(error).toBeNull();
        expect(content).toEqual({ foo: { abc: { data: '123' } } });
      });
    });

    test('should read data from file and returns error from data that can not json parse', () => {
      function throwJsonError() {
        const storage = new StorageFS('storageKey', { storagePath: 'src/json/error' });
        storage.set('abc', '123', noop);
      }

      expect(throwJsonError).toThrowError(`
            Error reading file src/json/error
            Error: SyntaxError: Unexpected token o in JSON at position 1
          `);
    });
  });
})
;
