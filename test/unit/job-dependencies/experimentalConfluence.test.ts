import * as Chance from 'chance';
import dependency from '../../../src/job-dependencies/experimentalConfluence/dependency';

const chance = new Chance();

const pageByCQLResponse = {
  results: [
    {
      _links: {
        webui: 'webui',
      },
      title: 'title',
      body: {
        view: {
          value: 'value',
        },
      },

    },
  ],
};

const byCQLResponse = {
  results: [],
};

const pageByIdResponse = {
  body: {
    view: {
      value: 'value',
    },
  },
  title: 'title',
};

const easyRequest = jest.fn((opts: any, cb: any) => {
  if (opts.url.includes('by.id/error')) {
    cb('Error', pageByIdResponse);
  } else if (opts.url.includes('by.cql/error')) {
    cb('Error', pageByCQLResponse);
  } else if (opts.url.includes('by.cql/no/results')) {
    cb(null, byCQLResponse);
  } else if (opts.url.includes('by.cql')) {
    cb(null, pageByCQLResponse);
  } else {
    cb(null, pageByIdResponse);
  }
});

const jobWorker = {
  config: {
    globalAuth: {
      auth: {
        password: 'password',
        username: 'username',
      },
    },
  },
  dependencies: {
    easyRequest: {
      JSON: easyRequest,
    },
  },
};

describe('Job Dependencies: Confluence', () => {
  test('Should return the error received from easyRequest for getPageById', (done: any) => {
    const pageId = chance.natural({ min: 1, max: 9999 });
    dependency(jobWorker)
      .getPageById('https://by.id/error', 'auth', pageId, (err: any, response: any) => {
        const request = jobWorker.dependencies.easyRequest.JSON;
        const expectedOptions = {
          auth: {
            pass: 'password',
            user: 'username',
          },
          qs: {
            expand: 'body.view',
          },
          url: `https://by.id/error/rest/api/content/${pageId}`,
        };
        expect(err).toEqual('Error');
        expect(response).toBeUndefined();
        expect(request).toHaveBeenLastCalledWith(expectedOptions, expect.anything());
        done();
      });
  });

  test('Should return response received from easyRequest for getPageById', (done: any) => {
    const pageId = chance.natural({ min: 1, max: 9999 });
    dependency(jobWorker)
      .getPageById('https://by.id', 'auth', pageId, (err: any, response: any) => {
        const request = jobWorker.dependencies.easyRequest.JSON;
        const expectedOptions = {
          auth: {
            pass: 'password',
            user: 'username',
          },
          qs: {
            expand: 'body.view',
          },
          url: `https://by.id/rest/api/content/${pageId}`,
        };
        expect(err).toBeNull();
        expect(response).toEqual({ content: 'value', title: 'title' });
        expect(request).toHaveBeenLastCalledWith(expectedOptions, expect.anything());
        done();
      });
  });

  test('Should return the error received from easyRequest for getPageByCQL', (done: any) => {
    const query = chance.string();
    dependency(jobWorker)
      .getPageByCQL('https://by.cql/error', 'auth', query, (err: any, response: any) => {
        const request = jobWorker.dependencies.easyRequest.JSON;
        const expectedOptions = {
          auth: {
            pass: 'password',
            user: 'username',
          },
          qs: {
            cql: query,
            expand: 'body.view',
            limit: 1,
          },
          url: 'https://by.cql/error/rest/api/content',
        };
        expect(err).toEqual('Error');
        expect(response).toBeUndefined();
        expect(request).toHaveBeenLastCalledWith(expectedOptions, expect.anything());
        done();
      });
  });

  test('Should return no results error for getPageByCQL', (done: any) => {
    const query = chance.string();
    dependency(jobWorker)
      .getPageByCQL('https://by.cql/no/results', 'auth', query, (err: any, response: any) => {
        const request = jobWorker.dependencies.easyRequest.JSON;
        const expectedOptions = {
          auth: {
            pass: 'password',
            user: 'username',
          },
          qs: {
            cql: query,
            expand: 'body.view',
            limit: 1,
          },
          url: 'https://by.cql/no/results/rest/api/content',
        };
        expect(err).toBeNull();
        expect(response).toEqual(new Error(`No page matching query ${query}`));
        expect(request).toHaveBeenLastCalledWith(expectedOptions, expect.anything());
        done();
      });
  });

  test('Should return response received from easyRequest for getPageByCQL', (done: any) => {
    const query = chance.string();
    dependency(jobWorker)
      .getPageByCQL('https://by.cql', 'auth', query, (err: any, response: any) => {
        const request = jobWorker.dependencies.easyRequest.JSON;
        const expectedOptions = {
          auth: {
            pass: 'password',
            user: 'username',
          },
          qs: {
            cql: query,
            expand: 'body.view',
            limit: 1,
          },
          url: 'https://by.cql/rest/api/content',
        };
        expect(err).toBeNull();
        expect(response).toEqual({ content: 'value', title: 'title', webLink: 'webui' });
        expect(request).toHaveBeenLastCalledWith(expectedOptions, expect.anything());
        done();
      });
  });

  test('Should call easyRequest without auth data', (done: any) => {
    const query = chance.string();
    dependency(jobWorker)
      .getPageByCQL('https://by.cql', '', query, (err: any, response: any) => {
        const request = jobWorker.dependencies.easyRequest.JSON;
        const expectedOptions = {
          qs: {
            cql: query,
            expand: 'body.view',
            limit: 1,
          },
          url: 'https://by.cql/rest/api/content',
        };
        expect(request).toHaveBeenLastCalledWith(expectedOptions, expect.anything());
        done();
      });
  });
});
