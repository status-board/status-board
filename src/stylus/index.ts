import * as nib from 'nib';
import * as realStylus from 'stylus';
import { getStylusObject } from './get-stylus-object';

export const stylus = {
  /**
   * Returns stylus middleware configured to use Atlasboard themes
   * @param options
   * @returns {*}
   */
  getMiddleware(options: any) {
    return realStylus.middleware({
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
