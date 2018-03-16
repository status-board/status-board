/**
 * Executes a command in a childProcess
 */
export function executeCommand(cmd: any, args: any, callback: any) {
  const childProcess = require('child_process');
  const child = childProcess.spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', (err: any) => {
    callback(err);
  });
  child.on('exit', (code: any) => {
    callback(null, code);
  });
}
