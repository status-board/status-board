import * as path from 'path';

function getFromRootPath(paths: string[]) {
  return path.join(...paths);
}

export function fromAtlasboard(...args: string[]) {
  const paths = [__dirname];
  paths.push(...args);
  return getFromRootPath(paths);
}

export function fromLocalWallboard(...args: string[]) {
  const paths = [process.cwd()];
  paths.push(...args);
  return getFromRootPath(paths);
}
