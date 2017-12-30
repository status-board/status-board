import * as path from 'path';
import { fromAtlasboard, fromLocalWallboard } from '../../src/path-resolver';

const path1: string = '/path1';
const path2: string = '/path2';

describe('Path Resolver', () => {
  test('Should resolve the paths from local wall board', () => {
    const paths: string[] = [process.cwd()];
    paths.push(path1, path2);

    expect(fromLocalWallboard(path1, path2))
      .toMatch(path.join(...paths));
  });

  test('Should resolve the paths from atlas board', () => {
    expect(fromAtlasboard(path1, path2))
      .toEqual(expect.stringContaining(path.join(path1, path2)));
  });
});
