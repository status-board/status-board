import * as path from 'path';
import { noop } from '../../../src/helpers';
import * as itemManager from '../../../src/item-manager';
import * as matchJobFilter from '../../../src/job-manager/match-job-filter';
import { processDashboard } from '../../../src/job-manager/process-dashboard';
import logger from '../../../src/logger';

jest.mock('../../../src/logger', () => {
  const errorMock = jest.fn();
  return {
    default: () => ({ error: errorMock }),
    error: errorMock,
  };
});

describe('Job Manager: Process Dashboard', () => {
  beforeEach(() => {
    jest.spyOn(itemManager,'resolveCandidates').mockImplementation(noop);
    jest.spyOn(matchJobFilter,'matchJobFilter').mockImplementation(noop);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('test 1', () => {
    const allJobs = [''];
    const dashboardName = '';
    const dashboardConfig = {
      layout: {
        widgets: [{
          col: 0,
          config: '',
          height: 0,
          job: '',
          row: 0,
          widget: '',
          width: 0,
        }],
      },
    };
    const filters = {};

    const processedJob = processDashboard(allJobs, dashboardName, dashboardConfig, filters);

    expect(logger().error).not.toHaveBeenCalled();
  });
});
