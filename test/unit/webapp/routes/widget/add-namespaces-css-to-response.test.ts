import * as Chance from 'chance';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { addNamespacesCSSToResponse } from '../../../../../src/webapp/routes/widget';
import * as addNamespace from '../../../../../src/webapp/routes/widget/add-namespace';

const chance = new Chance();

describe('Webapp: Widget: Add Namespace CSS to Response', () => {
  let request: Request;
  let response: Response;

  beforeEach(() => {
    request = new Request();
    response = new Response();
    response.write = jest.fn();
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
  });

  test('should wrap namespaced css with style tags ', () => {
    jest.spyOn(addNamespace, 'addNamespace');
    const css = `div{ background-color:${chance.color({ format: 'hex' })} }`;
    const namespace = chance.string({ pool: 'abcdefghijklmnopqrstuvwxyz' });

    addNamespacesCSSToResponse(css, namespace, response);

    expect(response.write).toHaveBeenCalledWith('<style>');
    expect(addNamespace.addNamespace).toHaveBeenCalledWith(css, response, namespace);
    expect(response.write).toHaveBeenCalledWith('</style>');
  });
});
