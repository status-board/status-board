import { NextFunction,Request,Response } from 'express';
import * as nib from 'nib';
import * as realStylus from 'stylus';
import { getStylusObject } from './get-stylus-object';

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
export type Callback = (err: Error, css: string, js: string) => void;

export const stylus = {
  /**
   * Returns stylus middleware configured to use Atlasboard themes
   * @param options
   * @returns {*}
   */
  getMiddleware(options: { dest: string, src: string }): Middleware {
    return realStylus.middleware({
      dest: options.dest,
      src: options.src,

      compile(str: string, filePath: string) {
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
   * @param callback
   */
  getWidgetCSS(str: string, callback: Callback): void {
    getStylusObject(str).render(callback);
  },
};
