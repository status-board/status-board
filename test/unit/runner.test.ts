import { noop } from '../../src/helpers';
import * as jobInitialiser from '../../src/job-initialiser';
import { logger } from '../../src/logger';
import { runner } from '../../src/runner';
import * as server from '../../src/webapp/server';

describe('Runner', () => {
  beforeEach(() => {
    jest.spyOn(jobInitialiser, 'init').mockImplementation(noop);
    jest.spyOn(logger, 'log').mockImplementation(noop);
    jest.spyOn(server, 'server').mockImplementation(noop);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should match snapshot', () => {
    expect(runner).toMatchSnapshot();
  });
});
