import { get } from './get';
import { resolveCandidates } from './resolve-candidates';

/**
 * Return first candidate found matching name, type and extension
 *
 * @param {[string]} packagesPath : list of directories to find packages in.
 * @param {string} itemName item name to match.
 * It can be namespaced. i.e: atlassian#widget1, widget1
 * @param {string} itemType item type in plural. ('dashboards', 'jobs', 'widgets')
 * @param {string} extension : filter result by extension
 */
export function getFirst(packagesPath: string[],
                         itemName: string,
                         itemType: 'dashboards' | 'jobs' | 'widgets',
                         extension: string,
                         callback: any) {
  get(packagesPath, itemType, extension, (error: any, items: any) => {
    if (error) {
      return callback(error);
    }

    const candidates = resolveCandidates(items, itemName, itemType, extension);
    callback(null, candidates.length ? candidates[0] : null);
  });
}
