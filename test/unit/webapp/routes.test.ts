import * as Chance from 'chance';
import { system } from 'faker';
import * as logic from '../../../src/webapp/logic';
import routes from '../../../src/webapp/routes';
import * as dashboard from '../../../src/webapp/routes/dashboard';
import * as widget from '../../../src/webapp/routes/widget';
import { Express } from '../../helpers/express';

const chance = new Chance();
let app: any;

describe('Webapp: Routes', () => {
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
    spyOn.renderJsDashboard = jest.spyOn(logic, 'renderJsDashboard').mockImplementation();
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
    spyOn.renderJsDashboard.mockRestore();
    spyOn.renderHtmlWidget.mockRestore();
    spyOn.renderJsWidget.mockRestore();
    spyOn.renderWidgetResource.mockRestore();
  });

  test('Should call route and get the correct number of times', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledTimes(6);
    expect(app.mockedGet).toHaveBeenCalledTimes(6);
  });

  test('Should setup /widgets/resources route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledWith('/widgets/resources');
    expect(widget.renderWidgetResource).toHaveBeenCalledWith(
      expect.stringContaining('packages'),
      app.mockedRequest.query.resource,
      app.mockedRequest,
      app.mockedResponse,
    );
  });

  test('Should setup /widgets/:widget/js route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledWith('/widgets/:widget/js');
    expect(widget.renderJsWidget).toHaveBeenCalledWith(
      packagesPath,
      app.mockedRequest.params.widget,
      app.mockedRequest,
      app.mockedResponse,
    );
  });

  test('Should setup /widgets/:widget route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledWith('/widgets/:widget');
    expect(widget.renderHtmlWidget).toHaveBeenCalledWith(
      packagesPath,
      app.mockedRequest.params.widget,
      app.mockedRequest,
      app.mockedResponse,
    );
  });

  test('Should setup /:dashboard route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledWith('/:dashboard');
    expect(dashboard.renderDashboard).toHaveBeenCalledWith(
      packagesPath,
      app.mockedRequest.params.dashboard,
      app.mockedRequest,
      app.mockedResponse,
    );
  });

  test('Should setup /:dashboard/js route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledWith('/:dashboard/js');
    expect(logic.renderJsDashboard).toHaveBeenCalledWith(
      packagesPath,
      expect.stringContaining('assets'),
      app.mockedRequest.params.dashboard,
      app.mockedRequest,
      app.mockedResponse,
    );
  });

  test('Should setup / route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.mockedRoute).toHaveBeenCalledWith('/');
    expect(dashboard.listAllDashboards).toHaveBeenCalledWith(
      packagesPath,
      app.mockedRequest,
      app.mockedResponse,
    );
  });
});
