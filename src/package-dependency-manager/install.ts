import { executeCommand } from './execute-command';

/**
 * Install from package folder
 */
export function install(pathPackageJson: any, callback: any) {
  const currPath = process.cwd(); // save current path
  process.chdir(pathPackageJson);

  const isWindows = /^win/.test(process.platform);
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';

  executeCommand(
    npmCommand,
    ['install', '--production', pathPackageJson],
    (error: any, code: any) => {
      if (error) {
        callback(`Error installing dependencies for ${pathPackageJson}. err:${error}`);
      } else {
        callback(code !== 0 ? `error installing ${pathPackageJson}` : null);
      }
    });

  process.chdir(currPath); // restore path
}
