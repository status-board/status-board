import * as Chance from 'chance';
import * as css from 'css';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { namespaceRulesAST } from '../../../../../src/webapp/routes/widget';
import { IChanceSystem, system } from '../../../../helpers/chance-system';

const chance = new Chance() as Chance.Chance & IChanceSystem;
chance.mixin(system as any);

describe('Webapp: Widget: Namespace Rules AST', () => {
  let request: Request;
  let response: Response;

  beforeEach(() => {
    request = new Request();
    response = new Response();
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
  });

  test('should namespace selectors', () => {
    const code = `div{ background-color:${chance.color({ format: 'hex' })} }`;
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const stylesheet = css.parse(code);
    const expectedSelector = `#widgets-container > ul > li[data-widget-id="${namespace}"] div`;
    const rules = stylesheet.stylesheet.rules[0];

    const selector = rules.selectors[0];
    expect(selector).toMatch('div');

    namespaceRulesAST(stylesheet.stylesheet, namespace);

    const namespacedSelector = rules.selectors[0];
    expect(namespacedSelector).toMatch(expectedSelector);
  });

  test('should not namespace fonts', () => {
    const fontFamily = chance.name();
    const fontFile = chance.fileName();
    const code = `@font-face{font-family:'${fontFamily}';src:url('${fontFile}');}`;
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const stylesheet = css.parse(code);
    const rules = stylesheet.stylesheet.rules[0];

    expect(rules).not.toHaveProperty('selectors');

    namespaceRulesAST(stylesheet.stylesheet, namespace);

    expect(rules).not.toHaveProperty('selectors');
  });

  test('should namespace selectors in media queries', () => {
    const code = `@media screen and (min-width: 1200px) {div{ background-color:${chance.color({ format: 'hex' })} }}`;
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const stylesheet = css.parse(code);
    const expectedSelector = `#widgets-container > ul > li[data-widget-id="${namespace}"] div`;
    const rules = stylesheet.stylesheet.rules[0];

    const selector = rules.rules[0].selectors[0];
    expect(selector).toMatch('div');

    namespaceRulesAST(stylesheet.stylesheet, namespace);

    const namespacedSelector = rules.rules[0].selectors[0];
    expect(namespacedSelector).toMatch(expectedSelector);
  });
});
