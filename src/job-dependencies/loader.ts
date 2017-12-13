import * as fs from 'fs';
import * as path from 'path';

export function fillDependencies(jobWorker: any, deps: any) {
  jobWorker.dependencies = {};

  const dependencyFolders = fs.readdirSync(__dirname);

  for (let i = dependencyFolders.length - 1; i >= 0; i--) {
    const folderPath = path.join(__dirname, dependencyFolders[i]);
    const stat = fs.statSync(folderPath);
    if (stat.isDirectory()) {
      try {
        const depPath = path.join(folderPath, 'dependency.js');
        jobWorker.dependencies[dependencyFolders[i]] = require(depPath)(jobWorker, deps);
      } catch (error) {
        throw Error(`
          Error resolving dependency: ${dependencyFolders[i]}
          Dependencies required: ${path.join(folderPath, 'dependency.js')}
          Stack trace: ${error}
        `);
      }
    }
  }
}
