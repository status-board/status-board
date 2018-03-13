import * as Chance from 'chance';
import * as css from 'css';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { noop } from '../../../../../src/helpers';
import { logger } from '../../../../../src/logger';
import { addNamespace } from '../../../../../src/webapp/routes/widget';

const chance = new Chance();

describe('Webapp: Widget: Add Namespace', () => {
  let request: any;
  let response: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();
    response.write = jest.fn();
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
  });

  test('should not write response if code is undefined', () => {
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });

    addNamespace(undefined, response, namespace);

    expect(response.write).not.toHaveBeenCalled();
  });

  test('should write css with widget namespaceing', () => {
    const code = `div{ background-color:${chance.color({ format: 'hex' })} }`;
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });
    const stylesheet = css.parse(code);
    const stringifyCode = css.stringify(stylesheet);
    const expectedCode = `#widgets-container > ul > li[data-widget-id="${namespace}"] ${stringifyCode}`;

    addNamespace(code, response, namespace);

    expect(response.write).toHaveBeenCalledWith(expectedCode);
  });

  test('should not write if code is empty', () => {
    const code = '';
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });

    addNamespace(code, response, namespace);

    expect(response.write).not.toHaveBeenCalled();
  });

  test('should log any errors', () => {
    const error = chance.word();
    jest.spyOn(css, 'parse').mockImplementation(() => {
      throw new Error(error);
    });
    jest.spyOn(logger, 'error').mockImplementation(noop);
    const code = `div{ background-color:${chance.color({ format: 'hex' })} }`;
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });

    addNamespace(code, response, namespace);

    expect(logger.error).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(Error(error));
  });
});
