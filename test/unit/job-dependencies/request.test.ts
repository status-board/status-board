import * as Chance from 'chance';
import * as request from 'request';

const chance = new Chance();

jest.mock('fs');
jest.mock('path');
jest.mock('request', () => {
  return {
    defaults: jest.fn(),
  };
});

describe('Job Dependencies: Request', () => {
  const MOCK_FILE = {
    version: chance.semver(),
  };

  beforeEach(() => {
    require('fs').__setMockedFile(MOCK_FILE);
  });

  test('Should setup request', () => {
    const requestDependence = require('../../../src/job-dependencies/request/dependency').default;
    const expectedOptions = {
      headers: {
        'User-Agent': `Status Board/${MOCK_FILE.version}`,
      },
      jar: true,
    };

    requestDependence();

    expect(request.defaults).toHaveBeenCalled();
    expect(request.defaults).toHaveBeenCalledWith(expectedOptions);
  });
});
