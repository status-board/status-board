import * as async from 'async';
import * as fs from 'fs';
import * as path from 'path';
import readJson from 'read-package-json';
import * as semver from 'semver';
import * as _ from 'underscore';

const atlasboardPackageJsonPath = path.join(__dirname, '../'); // in both test and production env will be located here.

/**
 * Search for packages in the current folder
 */
function checkPackagesFolder(packagesPath: any, cb: any) {
  fs.readdir(packagesPath, (err, allPackagesDir) => {
    if (err) {
      return cb(err);
    }

    // convert to absolute path
    allPackagesDir = allPackagesDir.map((partialDir) => {
      return path.join(packagesPath, partialDir);
    });

    // make sure we have package.json file
    allPackagesDir = allPackagesDir.filter((dir) => {
      return fs.statSync(dir).isDirectory() && fs.existsSync(dir + '/package.json');
    });

    cb(null, allPackagesDir);
  });
}

/**
 * Install from package folder
 */
function getValidPackageJSON(pathPackage: any, callback: any) {
  readJson(pathPackage + '/package.json', callback);
}

/**
 * Install from package folder
 */
function checkValidIfAtlasboardVersionForPackage(pathPackage: any, callback: any) {
  getValidPackageJSON(pathPackage, (err: any, packageJson: any) => {
    if (err) {
      return callback(err);
    }

    getValidPackageJSON(atlasboardPackageJsonPath, (err: any, atlasboardPackageJson: any) => {
      if (err) {
        return callback('package.json not found for atlasboard at ' + atlasboardPackageJsonPath);
      }

      if (packageJson.engines && packageJson.engines.atlasboard) {
        const ok = semver.satisfies(atlasboardPackageJson.version, packageJson.engines.atlasboard);
        const msg = 'Atlasboard version does not satisfy package dependencies at ' +
          pathPackage + '. Please consider updating your version of atlasboard. Version required: ' +
          packageJson.engines.atlasboard + '. Atlasboard version: ' + atlasboardPackageJson.version;

        callback(ok ? null : msg);
      } else {
        callback(null); // not atlasboard reference in engines node
      }
    });
  });
}

/**
 * Install from package folder
 */
function install(pathPackageJson: any, callback: any) {
  const currPath = process.cwd(); // save current path
  process.chdir(pathPackageJson);

  const isWindows = /^win/.test(process.platform);
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';

  executeCommand(npmCommand, ['install', '--production', pathPackageJson], (err: any, code: any) => {
    if (err) {
      callback('Error installing dependencies for ' + pathPackageJson + '. err:' + err);
    } else {
      callback(code !== 0 ? 'error installing ' + pathPackageJson : null);
    }
  });

  process.chdir(currPath); // restore path
}

/**
 * Executes a command in a childProcess
 */

function executeCommand(cmd: any, args: any, callback: any) {
  const childProcess = require('child_process');
  const child = childProcess.spawn(cmd, args, { stdio: 'inherit' });
  child.on('error', (err: any) => {
    callback(err);
  });
  child.on('exit', (code: any) => {
    callback(null, code);
  });
}

export function installDependencies(packagesPath: any, callback: any) {
  // Process all available package containers
  async.map(packagesPath.filter(fs.existsSync), checkPackagesFolder, (err, results) => {
    if (err) {
      return callback(err);
    }
    const paths = _.flatten(results);

    async.eachSeries(paths, checkValidIfAtlasboardVersionForPackage, (err: any) => {
      if (err) {
        return callback(err);
      }

      async.eachSeries(paths, install, (err: any) => {
        callback(err);
      });
    });
  });
}