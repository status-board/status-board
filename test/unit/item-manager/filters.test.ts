import * as Chance from 'chance';
import * as fs from 'fs';
import { noop } from '../../../src/helpers';
import { filters } from '../../../src/item-manager/filters';
import { logger } from '../../../src/logger';
import { system } from '../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Item Manager: Filters', () => {

  beforeEach(() => {
    jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
      if (path.includes('NOT_ENABLED')) {
        return Buffer.from('{"enabled": false}', 'utf8');
      } else if (path.includes('THROW_ERROR')) {
        throw new Error('Whoops!');
      } else {
        return Buffer.from('{"enabled": true}', 'utf8');
      }
    });
    jest.spyOn(logger, 'error').mockImplementation(noop);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return true if dashboard is enabled', () => {
    const { dashboards } = filters;
    const dashboardPath = chance.system.filePath();

    const shouldBeFiltered = dashboards(dashboardPath);

    expect(shouldBeFiltered).toBeTruthy();
    expect(logger.error).not.toHaveBeenCalled();
  });

  test('should return false if dashboard is disabled', () => {
    const { dashboards } = filters;
    const dashboardPath = `/NOT_ENABLED${chance.system.filePath()}`;

    const shouldBeFiltered = dashboards(dashboardPath);

    expect(shouldBeFiltered).toBeFalsy();
    expect(logger.error).not.toHaveBeenCalled();
  });

  test('should return false a log error if dashboard is invalid or doesnt exist', () => {
    const { dashboards } = filters;
    const dashboardPath = `/THROW_ERROR${chance.system.filePath()}`;

    const shouldBeFiltered = dashboards(dashboardPath);

    expect(shouldBeFiltered).toBeFalsy();
    expect(logger.error).toBeCalledWith(`## ERROR ## ${dashboardPath} has an invalid format or file doesn't exist\n`);
  });
});
