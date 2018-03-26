import * as fs from 'fs';
import logger from '../../../src/logger';

import { readDashboard } from '../../../src/job-manager/read-dashboard';

jest.mock('../../../src/logger', () => {
  const errorMock = jest.fn();
  return {
    default: () => ({ error: errorMock }),
    error: errorMock,
  };
});

describe('Job Manager: Read Dashboard', () => {
  beforeEach(() => {
    jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
      if (path === '/works') {
        return JSON.stringify({
          layout: {
            widgets: [
              {
                row: 1,
                col: 1,
                width: 2,
                height: 1,
                widget: 'linegraph',
                job: 'sales-graph',
                config: 'sales',
              },
            ],
          },
        });
      }
      if (path === '/missing/widgets') {
        return JSON.stringify({
          layout: {},
        });
      }
      if (path === '/missing/layout') {
        return JSON.stringify({});
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return a dashboard config object', () => {
    const config = readDashboard('/works');

    expect(config).toHaveProperty('layout', {
      widgets: [{
        col: 1,
        config: 'sales',
        height: 1,
        job: 'sales-graph',
        row: 1,
        widget: 'linegraph',
        width: 2,
      }],
    });
    expect(logger().error).not.toHaveBeenCalled();
  });
  test('should return a error if the dashboard config is missing a widget property', () => {
    const config = readDashboard('/missing/widgets');

    expect(config).toBeUndefined();
    expect(logger().error).toHaveBeenCalledWith('No widgets field found in /missing/widgets');
  });
  test('should return a error if the dashboard config is missing a layout property', () => {
    const config = readDashboard('/missing/layout');

    expect(config).toBeUndefined();
    expect(logger().error).toHaveBeenCalledWith('No layout field found in /missing/layout');
  });
});
