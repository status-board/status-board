import * as path from 'path';

function getFromRootPath(root: any, ...args: any[]) {
  Array.prototype.splice.call(args, 0, 0, root);
  return path.join.apply(null, args);
}

export function fromAtlasboard(...args: any[]) {
  return getFromRootPath(__dirname, args);
}

export function fromLocalWallboard(...args: any[]) {
  return getFromRootPath(process.cwd(), args);
}
