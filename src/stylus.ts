import * as bug from 'debug';
import * as fs from 'fs';
import * as nib from 'nib';
import * as stylus from 'stylus';

import configManager from './config-manager';
import { fromAtlasboard, fromLocalWallboard } from './path-resolver';

const debug = bug('theming');

export default function () {
  const themingConfig = configManager('theming');

  const localTheme = fromLocalWallboard('themes', themingConfig.theme, 'variables.styl');
  const atlasboardTheme = fromAtlasboard('../themes', themingConfig.theme, 'variables.styl');

  const defaultTheme = fromAtlasboard('../assets', 'stylesheets', 'variables.styl');

  function getStylusObject(str: any) {
    const stylObj = stylus(str);
    stylObj.import(defaultTheme); // import default core stylus variables

    if (fs.existsSync(localTheme)) { // try importing local theme first
      debug('importing local theme', localTheme);
      stylObj.import(localTheme);
    } else if (fs.existsSync(atlasboardTheme)) { // try importing from atlasboard's theme folder
      debug('importing atlasboard theme', atlasboardTheme);
      stylObj.import(atlasboardTheme);
    }
    return stylObj;
  }

  return {

    /**
     * Returns stylus middleware configured to use Atlasboard themes
     * @param options
     * @returns {*}
     */
    getMiddleware(options: any) {
      return stylus.middleware({
        dest: options.dest,
        src: options.src,

        compile(str: any, filePath: any) {
          const stylObj = getStylusObject(str);
          stylObj.set('filename', filePath)
            .set('warn', false)
            .set('compress', true)
            .use(nib());

          return stylObj;
        },
      });
    },

    /**
     * Process widget stylus
     * @param str
     * @param cb
     */
    getWidgetCSS(str: any, cb: any) {
      getStylusObject(str).render(cb);
    },
  };
}
