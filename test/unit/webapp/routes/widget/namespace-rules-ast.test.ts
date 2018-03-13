import * as Chance from 'chance';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { system } from '../../../../helpers/chance-system';

import { log } from '../../../../../src/webapp/routes/widget';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Namespace Rules AST', () => {
  let request: any;
  let response: any;

  beforeEach(() => {
    request = new Request();
    response = new Response();
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
  });

  test('test', () => {
    // widget.addNamespace();
    expect(true).toEqual(true);
  });
});
