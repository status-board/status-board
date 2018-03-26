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

export type Callback = (err: Error, css: string, js: string) => void;

export interface IStylusObject {
  render: (callback: Callback) => void;
  set: (key: string, val: any) => this;
  use: (fn: (renderer: IStylusObject) => any) => this;
}

export function getStylusObject(str: string): IStylusObject {
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
