import * as bug from 'debug';
import * as fs from 'fs';
import * as stylus from 'stylus';
import { configManager } from '../config-manager';
import { fromAtlasboard, fromLocalWallboard } from '../path-resolver';

const debug = bug('theming');
const themingConfig = configManager('theming');
const localTheme = fromLocalWallboard('themes', themingConfig.theme, 'variables.styl');
const atlasboardTheme = fromAtlasboard('../themes', themingConfig.theme, 'variables.styl');
const defaultTheme = fromAtlasboard('../assets', 'stylesheets', 'variables.styl');

export function getStylusObject(str: any): any {
  const stylObj = stylus(str);

  // import default core stylus variables
  stylObj.import(defaultTheme);

  // try importing local theme first
  if (fs.existsSync(localTheme)) {
    debug('importing local theme', localTheme);
    stylObj.import(localTheme);

    // try importing from atlasboard's theme folder
  } else if (fs.existsSync(atlasboardTheme)) {
    debug('importing atlasboard theme', atlasboardTheme);
    stylObj.import(atlasboardTheme);
  }

  return stylObj;
}
