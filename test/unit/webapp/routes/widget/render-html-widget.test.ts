import * as Chance from 'chance';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { renderHtmlWidget } from '../../../../../src/webapp/routes/widget';
import * as loadCSSIfPresent from '../../../../../src/webapp/routes/widget/load-css-if-present';
import * as loadHTML from '../../../../../src/webapp/routes/widget/load-html';
import * as loadStylusIfPresent from '../../../../../src/webapp/routes/widget/load-stylus-if-present';
import { system } from '../../../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Webapp: Widget: Render HTML Widget', () => {
  let request: Request;
  let response: Response;
  let packagesPath: any;
  let widgetName: any;

  beforeEach(() => {
    packagesPath = chance.system.filePath();
    widgetName = chance.name();
    request = new Request();
    response = new Response();
    jest.spyOn(loadStylusIfPresent, 'loadStylusIfPresent')
      .mockImplementation((res, name, path, cb) => cb());
    jest.spyOn(loadCSSIfPresent, 'loadCSSIfPresent')
      .mockImplementation((res, name, path, cb) => cb());
    jest.spyOn(loadHTML, 'loadHTML')
      .mockImplementation((res, name, path, cb) => {
        if (name === 'LOAD_HTML_ERROR') {
          cb('ERROR');
        } else {
          cb();
        }
      });
  });

  afterEach(() => {
    request.resetMocked();
    response.resetMocked();
    jest.restoreAllMocks();
  });

  test('should renders html widget', () => {
    const packagesPath = chance.system.filePath();
    const widgetName = chance.name();

    renderHtmlWidget(packagesPath, widgetName, request, response);

    expect(response.type)
      .toBeCalledWith('text/html');
    expect(loadStylusIfPresent.loadStylusIfPresent)
      .toBeCalledWith(response, widgetName, packagesPath, expect.any(Function));
    expect(loadCSSIfPresent.loadCSSIfPresent)
      .toBeCalledWith(response, widgetName, packagesPath, expect.any(Function));
    expect(loadHTML.loadHTML)
      .toBeCalledWith(response, widgetName, packagesPath, expect.any(Function));
    expect(response.status).not.toHaveBeenCalled();
    // expect(response.status).toBeCalledWith(500);
    expect(response.send).not.toHaveBeenCalled();
    // expect(response.send).toBeCalledWith('Error rendering widget: Error');
    expect(response.end).toHaveBeenCalled();
  });

  test('should respond with error from load html', () => {
    const packagesPath = chance.system.filePath();
    const widgetName = 'LOAD_HTML_ERROR';

    renderHtmlWidget(packagesPath, widgetName, request, response);

    expect(response.type)
      .toBeCalledWith('text/html');
    expect(loadStylusIfPresent.loadStylusIfPresent)
      .toBeCalledWith(response, widgetName, packagesPath, expect.any(Function));
    expect(loadCSSIfPresent.loadCSSIfPresent)
      .toBeCalledWith(response, widgetName, packagesPath, expect.any(Function));
    expect(loadHTML.loadHTML)
      .toBeCalledWith(response, widgetName, packagesPath, expect.any(Function));
    expect(response.status).toBeCalledWith(500);
    expect(response.send).toBeCalledWith('Error rendering widget: ERROR');
    expect(response.end).not.toHaveBeenCalled();
  });
});
