import * as path from 'path';

function getFromRootPath(root: any, args: any) {
  Array.prototype.splice.call(args, 0, 0, root);
  return path.join.apply(null, args);
}

export function fromAtlasboard() {
  return getFromRootPath(__dirname, arguments);
}

export function fromLocalWallboard() {
  return getFromRootPath(process.cwd(), arguments);
}
