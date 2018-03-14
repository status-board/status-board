import * as Chance from 'chance';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { system } from '../../../../helpers/chance-system';

import { renderWidgetResource } from '../../../../../src/webapp/routes/widget';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Render Widget Resource', () => {
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

  test('test', () => {
    renderWidgetResource();
    expect(true).toEqual(true);
  });
});
