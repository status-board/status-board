import * as fs from 'fs';
import { getByPackage } from '../../../src/item-manager';

jest.mock('fs');

describe('Item Manager: Get By Package', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('file extension doesn\'t match expected extension', () => {
    const packagesPath = '/file/doesnt/match/extension';
    const itemType = 'widgets';
    const extension = '.js';
    const expectedResults = [
      {
        dir: '/file/doesnt/match/extension/fake-directory',
        items: [],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('fill packages fs.readdir returns error', () => {
    const packagesPath = '/fill/packages/error';
    const itemType = 'widgets';
    const extension = '.js';

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toEqual('ERROR');
      expect(results).toBeUndefined();
    });
  });

  test('read items from package dir fs.readdir returns error', () => {
    const packagesPath = '/read/items/from/package/dir/error';
    const itemType = 'widgets';
    const extension = '.js';

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toEqual('ERROR');
      expect(results).toBeUndefined();
    });
  });

  test('creates a empty items array if there is no item directory', () => {
    const packagesPath = '/empty/item/directory';
    const itemType = 'dashboards';
    const extension = '.json';
    const expectedResults = [
      {
        dir: '/empty/item/directory/fake-directory',
        items: [],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('if packagesPath is a string will make a array', () => {
    const packagesPath = '/packages';
    const itemType = 'dashboards';
    const extension = '.json';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [
          '/packages/demo/dashboards/myfirst_dashboard.json',
        ],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('should return expected output for itemType dashboards ext json', () => {
    const packagesPath = [
      '/packages',
      '/node_modules/status-board/packages',
    ];
    const itemType = 'dashboards';
    const extension = '.json';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [
          '/packages/demo/dashboards/myfirst_dashboard.json',
        ],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('should return expected output for itemType jobs ext js', () => {
    const packagesPath = [
      '/packages',
      '/node_modules/status-board/packages',
    ];
    const itemType = 'jobs';
    const extension = '.js';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [
          '/packages/demo/jobs/google-calendar/google-calendar.js',
          '/packages/demo/jobs/issue-types/issue-types.js',
          '/packages/demo/jobs/picture-of-the-day/picture-of-the-day.js',
          '/packages/demo/jobs/quotes/quotes.js',
          '/packages/demo/jobs/sales-graph/sales-graph.js',
        ],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('should return expected output for itemType widgets ext styl', () => {
    const packagesPath = [
      '/packages',
      '/node_modules/status-board/packages',
    ];
    const itemType = 'widgets';
    const extension = '.styl';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [
          '/packages/demo/widgets/calendar/calendar.styl',
          '/packages/demo/widgets/image/image.styl',
          '/packages/demo/widgets/keyvaluelist/keyvaluelist.styl',
          '/packages/demo/widgets/linegraph/linegraph.styl',
          '/packages/demo/widgets/quotes/quotes.styl',
        ],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('should return expected output for itemType widgets ext css', () => {
    const packagesPath = [
      '/packages',
      '/node_modules/status-board/packages',
    ];
    const itemType = 'widgets';
    const extension = '.css';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('should return expected output for itemType widgets ext html', () => {
    const packagesPath = [
      '/packages',
      '/node_modules/status-board/packages',
    ];
    const itemType = 'widgets';
    const extension = '.html';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [
          '/packages/demo/widgets/calendar/calendar.html',
          '/packages/demo/widgets/image/image.html',
          '/packages/demo/widgets/keyvaluelist/keyvaluelist.html',
          '/packages/demo/widgets/linegraph/linegraph.html',
          '/packages/demo/widgets/quotes/quotes.html',
        ],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

  test('should return expected output for itemType widgets ext js', () => {
    const packagesPath = [
      '/packages',
      '/node_modules/status-board/packages',
    ];
    const itemType = 'widgets';
    const extension = '.js';
    const expectedResults = [
      {
        dir: '/packages/default',
        items: [],
      },
      {
        dir: '/packages/demo',
        items: [
          '/packages/demo/widgets/calendar/calendar.js',
          '/packages/demo/widgets/image/image.js',
          '/packages/demo/widgets/keyvaluelist/keyvaluelist.js',
          '/packages/demo/widgets/linegraph/linegraph.js',
          '/packages/demo/widgets/quotes/quotes.js',
        ],
      },
    ];

    getByPackage(packagesPath, itemType, extension, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
    });
  });

});
