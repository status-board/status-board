import * as Chance from 'chance';
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

jest.mock('/packages/demo/jobs/sales-graph/sales-graph.js', () => ({
  settings: 'someSetting',
}),       { virtual: true });
jest.mock('/packages/demo/jobs/issue-types/issue-types.js', () => ({
  settings: 'someSetting',
}),       { virtual: true });
jest.mock('/packages/demo/jobs/picture-of-the-day/picture-of-the-day.js', () => ({
  settings: 'someSetting',
}),       { virtual: true });
jest.mock('/packages/demo/jobs/quotes/quotes.js', () => ({
  settings: 'someSetting',
}),       { virtual: true });
jest.mock('/packages/demo/jobs/google-calendar/google-calendar.js', () => ({
  settings: 'someSetting',
}),       { virtual: true });

const chance = new Chance();

describe('Job Manager: Process Dashboard', () => {
  beforeEach(() => {
    jest.spyOn(itemManager, 'resolveCandidates')
      .mockImplementation((items: string[], name: string, itemType: string, extension: string) => {
        if (name === 'sales-graph') return ['/packages/demo/jobs/sales-graph/sales-graph.js'];
        if (name === 'picture-of-the-day') return ['/packages/demo/jobs/picture-of-the-day/picture-of-the-day.js'];
        if (name === 'quotes') return ['/packages/demo/jobs/quotes/quotes.js'];
        if (name === 'issue-types') return ['/packages/demo/jobs/issue-types/issue-types.js'];
        if (name === 'google-calendar') return ['/packages/demo/jobs/google-calendar/google-calendar.js'];

      });
    // jest.spyOn(matchJobFilter, 'matchJobFilter').mockImplementation(noop);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('happy path test', () => {
    const allJobs = [
      '/packages/demo/jobs/google-calendar/google-calendar.js',
      '/packages/demo/jobs/issue-types/issue-types.js',
      '/packages/demo/jobs/picture-of-the-day/picture-of-the-day.js',
      '/packages/demo/jobs/quotes/quotes.js',
      '/packages/demo/jobs/sales-graph/sales-graph.js',
    ];
    const dashboardName = '/packages/demo/dashboards/myfirst_dashboard.json';
    const dashboardConfig = {
      title: 'My first dashboard',
      titleVisible: false,

      description: 'My first dashboard description goes here',

      layout: {
        customJS: ['jquery.peity.js'],
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
          {
            row: 1,
            col: 3,
            width: 2,
            height: 2,
            widget: 'image',
            job: 'picture-of-the-day',
            config: 'picture',
          },
          {
            row: 1,
            col: 5,
            width: 2,
            height: 4,
            widget: 'quotes',
            job: 'quotes',
            config: 'quotes-famous',
          },
          {
            row: 2,
            col: 1,
            width: 2,
            height: 3,
            widget: 'keyvaluelist',
            job: 'issue-types',
            config: 'issue-types',
          },
          {
            row: 3,
            col: 2,
            width: 2,
            height: 2,
            widget: 'calendar',
            job: 'google-calendar',
            config: 'calendar-holidays',
          },
        ],
      },

      config: {

        'calendar-holidays': {
          interval: 60000,
          calendarUrl: 'http://www.calendarlabs.com/templates/ical/US-Holidays.ics',
          maxEntries: 9,
          widgetTitle: 'Upcoming US Holidays',
        },

        'issue-types': {
          interval: 60000,
          widgetTitle: 'Issues Types in the Project',
          database: {
            host: 'mydatabase.mycompany.com',
            port: 1000,
            database: 'salesdb',
          },
        },

        picture: {
          interval: 60000,
          widgetTitle: 'Nat Geo Picture of the Day',
          url: 'http://www.nationalgeographic.com/photography/photo-of-the-day/_jcr_content/.gallery.json',
        },

        'quotes-famous': {
          interval: 60000,
          widgetTitle: 'Famous Quotes',
          quotes: [
            {
              author: 'Albert Einstein',
              quote: 'It\'s not that I\'m so smart, it\'s just that I stay with problems longer.',
            },
            {
              author: 'William Shakespeare',
              quote: 'Ignorance is the curse of God; knowledge is the wing wherewith we fly to heaven.',
            },
            {
              author: 'Ravi Simhambhatla',
              quote: 'Software built on pride and love of subject is superior to software built for profit.',
            },
            {
              author: 'Jeffrey Hammond',
              quote: 'If developers’ pains are Java and .NET, the antidote is dynamic languages and frameworks.',
            },
            {
              author: 'Linus Torvalds',
              quote: 'Software is like sex: it\'s better when it\'s free.',
            },
            {
              author: 'Linus Torvalds',
              quote: 'People enjoy the interaction on the Internet, and the feeling of belonging to a group that does something interesting: that\'s how some software projects are born.',
            },
            {
              author: 'Larry Page',
              quote: 'The ultimate search engine would basically understand everything in the world, and it would always give you the right thing.',
            },
            {
              author: 'Carl Friedrich Gauss',
              quote: 'Mathematics is the queen of the sciences and number theory is the queen of mathematics.',
            },
            {
              author: 'Edsger Dijkstra',
              quote: 'Computer science is no more about computers than astronomy is about telescopes.',
            },
          ],
          limit: 3,
        },

        sales: {
          interval: 60000,
          widgetTitle: 'Monthly Sales',
        },
      },
    };
    const filters = {};

    const processedJob = processDashboard(allJobs, dashboardName, dashboardConfig, filters);

    expect(processedJob).toEqual([{
      configKey: 'sales',
      dashboard_name: 'myfirst_dashboard',
      job_name: 'sales-graph',
      widget_item:
      {
        row: 1,
        col: 1,
        width: 2,
        height: 1,
        widget: 'linegraph',
        job: 'sales-graph',
        config: 'sales',
      },
      onRun: expect.any(Function),
      onInit: expect.any(Function),
    },
    {
      configKey: 'picture',
      dashboard_name: 'myfirst_dashboard',
      job_name: 'picture-of-the-day',
      widget_item:
      {
        row: 1,
        col: 3,
        width: 2,
        height: 2,
        widget: 'image',
        job: 'picture-of-the-day',
        config: 'picture',
      },
      onRun: expect.any(Function),
      onInit: expect.any(Function),
    },
    {
      configKey: 'quotes-famous',
      dashboard_name: 'myfirst_dashboard',
      job_name: 'quotes',
      widget_item:
      {
        row: 1,
        col: 5,
        width: 2,
        height: 4,
        widget: 'quotes',
        job: 'quotes',
        config: 'quotes-famous',
      },
      onRun: expect.any(Function),
      onInit: expect.any(Function),
    },
    {
      configKey: 'issue-types',
      dashboard_name: 'myfirst_dashboard',
      job_name: 'issue-types',
      widget_item:
      {
        row: 2,
        col: 1,
        width: 2,
        height: 3,
        widget: 'keyvaluelist',
        job: 'issue-types',
        config: 'issue-types',
      },
      onRun: expect.any(Function),
      onInit: expect.any(Function),
    },
    {
      configKey: 'calendar-holidays',
      dashboard_name: 'myfirst_dashboard',
      job_name: 'google-calendar',
      widget_item:
      {
        row: 3,
        col: 2,
        width: 2,
        height: 2,
        widget: 'calendar',
        job: 'google-calendar',
        config: 'calendar-holidays',
      },
      onRun: expect.any(Function),
      onInit: expect.any(Function),
    }]);

    expect(logger().error).not.toHaveBeenCalled();
  });
});
