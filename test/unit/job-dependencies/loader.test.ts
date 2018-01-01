import * as fs from 'fs';
import * as path from 'path';
import { fillDependencies } from '../../../src/job-dependencies/loader';

jest.mock(
  '../../../src/job-dependencies/foo/dependency.js',
  () => {
    return { default: () => jest.fn() };
  },
  { virtual: true },
);
jest.mock(
  '../../../src/job-dependencies/bar/dependency.js',
  () => {
    return { default: () => jest.fn() };
  },
  { virtual: true },
);

describe('Job Dependencies: Loader', () => {
  const spyOn: any = {};
  beforeAll(() => {
    spyOn.readdirSync = jest.spyOn(fs, 'readdirSync')
      .mockImplementationOnce(() => ['foo', 'bar'])
      .mockImplementationOnce(() => ['abc', '123']);
    spyOn.statSync = jest.spyOn(fs, 'statSync')
      .mockImplementation((folderPath: string) => {
        if (folderPath === './foo' || folderPath === './bar' || folderPath === './abc') {
          return {
            isDirectory: () => true,
          };
        }
        return {
          isDirectory: () => false,
        };
      });
    spyOn.join = jest.spyOn(path, 'join')
      .mockImplementation((dirname: string, dependencyFolders: string) => {
        if (dependencyFolders === 'foo' || dependencyFolders === 'bar' || dependencyFolders === 'abc') {
          return `./${dependencyFolders}`;
        } else if (dirname === './foo' || dirname === './bar' || dirname === './abc') {
          return `${dirname}/${dependencyFolders}`;
        }
      });
  });

  afterAll(() => {
    spyOn.readdirSync.mockRestore();
    spyOn.statSync.mockRestore();
    spyOn.join.mockRestore();
  });

  test('Should add job dependency to the jobWorker', () => {
    const jobWorker: any = {};
    const deps = {};

    fillDependencies(jobWorker, deps);

    expect(jobWorker.dependencies.foo).toBeDefined();
    expect(jobWorker.dependencies.bar).toBeDefined();
  });

  test('Should throw error if loader can not add the dependency', () => {
    const jobWorker: any = {};
    const deps = {};

    function dependenciesError() {
      fillDependencies(jobWorker, deps);
    }

    expect(dependenciesError).toThrowError(`Error resolving dependency: abc\nDependencies required: ./abc/dependency.js\nStack trace: Error: Cannot find module './abc/dependency.js' from 'loader.ts'`);
  });
});
