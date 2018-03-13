import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { log } from '../../../../../src/webapp/routes/widget';

describe('Webapp: Widget: Log', () => {
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

  test('should render with the dashboard template', () => {
    log(request, response);

    expect(response.render).toHaveBeenCalled();
    expect(response.render).toHaveBeenCalledWith(expect.stringContaining('templates/dashboard-log.ejs'));
  });
});
