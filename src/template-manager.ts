import * as fs from 'fs';
import * as path from 'path';

export default function () {
  return {
    /**
     * Resolve the appropriate template location based on the template name.
     * If the template exists in the wallboard directory, it will return that.
     * Otherwise it will return the default one from the Atlasboard directory.
     * @param {string} fileName
     * @param {function} cb
     */
    resolveTemplateLocation(fileName: any, cb: any) {
      const localWallboardLocation = path.join(process.cwd(), 'templates', fileName);
      const defaultAtlasboardLocation = path.join(__dirname, '../templates', fileName);
      fs.exists(localWallboardLocation, (exists) => {
        if (exists) {
          cb(null, localWallboardLocation);
        } else {
          cb(null, defaultAtlasboardLocation);
        }
      });
    },
  };
}
