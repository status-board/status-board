import chalk from 'chalk';
import * as path from 'path';
import { noop } from '../../src/helpers';
import { installDependencie } from '../../src/install-dependencie';
import { logger } from '../../src/logger';
import * as packageDependencyManager from '../../src/package-dependency-manager';
import { installDependencies } from '../../src/package-dependency-manager';

describe('Install Dependencie', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'log')
      .mockImplementation(noop);
    jest.spyOn(packageDependencyManager, 'installDependencies')
      .mockImplementation((pkgPath: string[], cb: (error?: string) => void) => {
        if (pkgPath[0].includes('error')) return cb('ERROR');
        return cb();
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('If install is false it should not call installDependencies', (done: () => void) => {
    const options = { install: false };
    const callback = (error: any) => {
      expect(error).toBeUndefined();
      expect(logger.log).not.toBeCalled();
      expect(packageDependencyManager.installDependencies).not.toBeCalled();
      done();
    };

    installDependencie(options, callback);
  });

  test('Should call install dependencies with the path to packages', (done: () => void) => {
    const options = { install: true };
    const callback = (error: any) => {
      expect(logger.log).toHaveBeenCalledWith(chalk.gray('Installing dependencies...'));
      expect(packageDependencyManager.installDependencies)
        .toHaveBeenCalledWith(
          [path.join(process.cwd(), '/packages')],
          expect.any(Function),
        );
      expect(error).toBeUndefined();
      expect(logger.log).toHaveBeenCalledWith(chalk.green('done!'));
      done();
    };

    installDependencie(options, callback);
  });

  describe('Install Dependencies Error', () => {
    beforeEach(() => {
      jest.spyOn(path, 'join').mockImplementation(() => '/error/packages');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('Should return error from install dependencies', (done: () => void) => {
      const options = { install: true };
      const callback = (error: any) => {
        expect(logger.log).toHaveBeenCalledWith(chalk.gray('Installing dependencies...'));
        expect(packageDependencyManager.installDependencies)
          .toHaveBeenCalledWith(
            [path.join(process.cwd(), '/packages')],
            expect.any(Function),
          );
        expect(error).toMatch('ERROR');
        done();
      };

      installDependencie(options, callback);
    });
  });
});
