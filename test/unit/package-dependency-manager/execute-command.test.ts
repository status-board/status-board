import * as Chance from 'chance';
import * as childProcess from 'child_process';
import { EventEmitter } from 'events';
import { executeCommand } from '../../../src/package-dependency-manager/execute-command';

const chance = new Chance();

describe('Package Dependency Manager: Execute Command', () => {
  const options = { stdio: 'inherit' };
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
    jest.spyOn(childProcess, 'spawn')
      .mockImplementation(() => {
        return emitter;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should spawn process and return error event message', () => {
    const cmd = chance.string();
    const args = chance.string();
    const errorMessage = chance.string();

    executeCommand(cmd, args, (error, code) => {
      expect(childProcess.spawn).toBeCalledWith(cmd, args, options);
      expect(error).toEqual(errorMessage);
      expect(code).toBeUndefined();
    });

    emitter.emit('error', errorMessage);
  });

  test('should spawn process and return exit event exit code', () => {
    const cmd = chance.string();
    const args = chance.string();
    const exitCode = chance.natural({ min: 0, max: 2 });

    executeCommand(cmd, args, (error, code) => {
      expect(childProcess.spawn).toBeCalledWith(cmd, args, options);
      expect(error).toBeNull();
      expect(code).toEqual(exitCode);
    });

    emitter.emit('exit', exitCode);
  });
});
