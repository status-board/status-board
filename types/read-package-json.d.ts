/**
 * readJson(file, [logFn = noop], [strict = false], cb)
 * file {String} The path to the package.json file
 * logFn {Function} Function to handle logging. Defaults to a noop.
 * strict {Boolean} True to enforce SemVer 2.0 version strings, and other strict requirements.
 * cb {Function} Gets called with (er, data), as is The Node Way.
 *
 * URL: https://github.com/npm/read-package-json
 */

declare module 'read-package-json' {

  type Callback = (error: any, obj: any) => void;

  function readJson(path: string, logFunction?: any, strict?: boolean, callback?: Callback): void;

  namespace readJson {

  }

  export = readJson;
}
