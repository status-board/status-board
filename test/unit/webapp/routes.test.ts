import * as Chance from 'chance';
import { system } from 'faker';
import * as logic from '../../../src/webapp/logic';
import routes from '../../../src/webapp/routes';
import * as dashboard from '../../../src/webapp/routes/dashboard';
import * as widget from '../../../src/webapp/routes/widget';
import { Express } from '../../helpers/express';

const chance = new Chance();
let app: any;

describe('Test', () => {
  const spyOn: any = {};

  beforeEach(() => {
    app = new Express();
    app.mockedRequest.setQuery('resource', chance.string());
    app.mockedRequest.setParams('widget', chance.string());
    app.mockedRequest.setParams('dashboard', chance.string());

    spyOn.log = jest.spyOn(logic, 'log').mockImplementation();
    spyOn.renderJsDashboard = jest.spyOn(logic, 'renderJsDashboard').mockImplementation();
    spyOn.listAllDashboards = jest.spyOn(dashboard, 'listAllDashboards').mockImplementation();
    spyOn.renderDashboard = jest.spyOn(dashboard, 'renderDashboard').mockImplementation();
    spyOn.renderHtmlWidget = jest.spyOn(widget, 'renderHtmlWidget').mockImplementation();
    spyOn.renderJsWidget = jest.spyOn(widget, 'renderJsWidget').mockImplementation();
    spyOn.renderWidgetResource = jest.spyOn(widget, 'renderWidgetResource').mockImplementation();
  });

  afterEach(() => {
    app.resetMocked();
    spyOn.log.mockRestore();
    spyOn.renderJsDashboard.mockRestore();
    spyOn.listAllDashboards.mockRestore();
    spyOn.renderDashboard.mockRestore();
    spyOn.renderHtmlWidget.mockRestore();
    spyOn.renderJsWidget.mockRestore();
    spyOn.renderWidgetResource.mockRestore();
  });

  test('Test', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedGet).toHaveBeenCalledTimes(6);
  });
});
