import * as Chance from 'chance';
import { noop } from '../../../src/helpers';
import * as executeCommand from '../../../src/package-dependency-manager/execute-command';
import { install } from '../../../src/package-dependency-manager/install';
import { IChanceSystem, system } from '../../helpers/chance-system';

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Package Dependency Manager: Install', () => {
  let errorMessage;
  let cwdMessage;

  beforeEach(() => {
    errorMessage = chance.string();
    cwdMessage = chance.string();
    jest.spyOn(process, 'cwd').mockImplementation(() => cwdMessage);
    jest.spyOn(process, 'chdir').mockImplementation(noop);
    jest.spyOn(executeCommand, 'executeCommand').mockImplementation((cmd, args, cb) => {
      if (args.includes('/error/installing/dependencies')) return cb(errorMessage);
      if (args.includes('/exit/code/1')) return cb(null, 1);
      cb(null, 0);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return a error message if the exit code is not 0', () => {
    const pathPackageJson = '/exit/code/1';

    install(pathPackageJson, (message) => {
      expect(message).toEqual(`error installing ${pathPackageJson}`);
    });
    expect(process.cwd).toHaveBeenCalled();
    expect(process.chdir).toHaveBeenCalledWith(pathPackageJson);
    expect(executeCommand.executeCommand).toHaveBeenCalledWith(
      'npm',
      ['install', '--production', pathPackageJson],
      expect.any(Function),
    );
    expect(process.chdir).toHaveBeenLastCalledWith(cwdMessage);
  });

  test('should return null if install was successful', () => {
    const pathPackageJson = chance.filePath();

    install(pathPackageJson, (message) => {
      expect(message).toBeNull();
    });
    expect(process.cwd).toHaveBeenCalled();
    expect(process.chdir).toHaveBeenCalledWith(pathPackageJson);
    expect(executeCommand.executeCommand).toHaveBeenCalledWith(
      'npm',
      ['install', '--production', pathPackageJson],
      expect.any(Function),
    );
    expect(process.chdir).toHaveBeenLastCalledWith(cwdMessage);
  });

  test('should return error message if execute command returns a error message', () => {
    const pathPackageJson = '/error/installing/dependencies';

    install(pathPackageJson, (message) => {
      expect(message).toEqual(`Error installing dependencies for ${pathPackageJson}. err:${errorMessage}`);
    });
    expect(process.cwd).toHaveBeenCalled();
    expect(process.chdir).toHaveBeenCalledWith(pathPackageJson);
    expect(executeCommand.executeCommand).toHaveBeenCalledWith(
      'npm',
      ['install', '--production', pathPackageJson],
      expect.any(Function),
    );
    expect(process.chdir).toHaveBeenLastCalledWith(cwdMessage);
  });

  describe('for windows', () => {
    let platform;

    beforeEach(() => {
      platform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
    });

    afterEach(() => {
      Object.defineProperty(process, 'platform', {
        value: platform,
      });
    });

    test('if platform is win32 it should call npm with npm.cmd', () => {
      const pathPackageJson = chance.filePath();

      install(pathPackageJson, (message) => {
        expect(message).toBeNull();
      });
      expect(process.cwd).toHaveBeenCalled();
      expect(process.chdir).toHaveBeenCalledWith(pathPackageJson);
      expect(executeCommand.executeCommand).toHaveBeenCalledWith(
        'npm.cmd',
        ['install', '--production', pathPackageJson],
        expect.any(Function),
      );
      expect(process.chdir).toHaveBeenLastCalledWith(cwdMessage);
    });
  });

});
