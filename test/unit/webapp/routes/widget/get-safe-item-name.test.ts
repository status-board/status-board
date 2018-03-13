import * as Chance from 'chance';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { system } from '../../../../helpers/chance-system';

import { getSafeItemName } from '../../../../../src/webapp/routes/widget';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Get Safe Item Name', () => {
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

  test('should return filename without extension from path', () => {
    const filePath = chance.system.filePath();
    const myRegexp = /.*\/(.+?)\./g;
    const match = myRegexp.exec(filePath);

    const itemName = getSafeItemName(filePath);

    expect(itemName).toEqual(match[1]);
  });
});
