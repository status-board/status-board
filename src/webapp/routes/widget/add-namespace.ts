import * as css from 'css';
import { Response } from 'express';
import logger from '../../../logger';
import { namespaceRulesAST } from './namespace-rules-ast';

export function addNamespace(code: string, response: Response, widgetNamespace: string) {
  if (code) {
    try {
      const cssAST: css.Stylesheet = css.parse(code);
      namespaceRulesAST(cssAST.stylesheet, widgetNamespace);
      response.write(css.stringify(cssAST));
    } catch (error) {
      logger().error(error);
    }
  }
}
