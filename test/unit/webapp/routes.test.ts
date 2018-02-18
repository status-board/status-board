import * as Chance from 'chance';
import { system } from 'faker';
import { Express } from 'jest-express/lib/express';
import * as logic from '../../../src/webapp/logic';
import routes from '../../../src/webapp/routes';
import * as dashboard from '../../../src/webapp/routes/dashboard';
import * as widget from '../../../src/webapp/routes/widget';

const chance = new Chance();
let app: any;

describe('Webapp: Routes', () => {
  beforeEach(() => {
    app = new Express();
    app.request.setQuery('resource', chance.string());
    app.request.setParams('widget', chance.string());
    app.request.setParams('dashboard', chance.string());

    jest.spyOn(logic, 'log').mockImplementation();
    jest.spyOn(logic, 'renderJsDashboard').mockImplementation();

    jest.spyOn(dashboard, 'listAllDashboards').mockImplementation();
    jest.spyOn(dashboard, 'renderDashboard').mockImplementation();
    jest.spyOn(widget, 'renderHtmlWidget').mockImplementation();
    jest.spyOn(widget, 'renderJsWidget').mockImplementation();
    jest.spyOn(widget, 'renderWidgetResource').mockImplementation();
  });

  afterEach(() => {
    app.resetMocked();
    logic.log.mockRestore();
    logic.renderJsDashboard.mockRestore();

    dashboard.listAllDashboards.mockRestore();
    dashboard.renderDashboard.mockRestore();

    widget.renderHtmlWidget.mockRestore();
    widget.renderJsWidget.mockRestore();
    widget.renderWidgetResource.mockRestore();
  });

  test('Should call route and get the correct number of times', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledTimes(6);
    expect(app.get).toHaveBeenCalledTimes(6);
  });

  test('Should setup /widgets/resources route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledWith('/widgets/resources');
    expect(widget.renderWidgetResource).toHaveBeenCalledWith(
      expect.stringContaining('packages'),
      app.request.query.resource,
      app.request,
      app.response,
    );
  });

  test('Should setup /widgets/:widget/js route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledWith('/widgets/:widget/js');
    expect(widget.renderJsWidget).toHaveBeenCalledWith(
      packagesPath,
      app.request.params.widget,
      app.request,
      app.response,
    );
  });

  test('Should setup /widgets/:widget route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledWith('/widgets/:widget');
    expect(widget.renderHtmlWidget).toHaveBeenCalledWith(
      packagesPath,
      app.request.params.widget,
      app.request,
      app.response,
    );
  });

  test('Should setup /:dashboard route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledWith('/:dashboard');
    expect(dashboard.renderDashboard).toHaveBeenCalledWith(
      packagesPath,
      app.request.params.dashboard,
      app.request,
      app.response,
    );
  });

  test('Should setup /:dashboard/js route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledWith('/:dashboard/js');
    expect(logic.renderJsDashboard).toHaveBeenCalledWith(
      packagesPath,
      expect.stringContaining('assets'),
      app.request.params.dashboard,
      app.request,
      app.response,
    );
  });

  test('Should setup / route', () => {
    const packagesPath = system.filePath();

    routes(app, packagesPath);

    expect(app.route).toHaveBeenCalledWith('/');
    expect(dashboard.listAllDashboards).toHaveBeenCalledWith(
      packagesPath,
      app.request,
      app.response,
    );
  });
});
