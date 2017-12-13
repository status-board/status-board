// This dependency is experimental and not suitable for general consumption.
// The API available here is liable to change without notice.

export default function (jobWorker: any) {
  function addAuthConfig(auth: any, opts: any) {
    const authData = jobWorker.config.globalAuth[auth];
    if (authData && authData.username && authData.password) {
      opts.auth = {
        pass: authData.password,
        user: authData.username,
      };
    }
  }

  return {
    getPageById(baseUrl: any, auth: any, pageId: any, cb: any) {
      const opts = {
        qs: {
          expand: 'body.view',
        },
        url: baseUrl + '/rest/api/content/' + pageId,
      };
      addAuthConfig(auth, opts);

      jobWorker.dependencies.easyRequest.JSON(opts, (err: any, body: any) => {
        if (err) {
          return cb(err);
        }

        cb(null, {
          content: body.body.view.value,
          title: body.title,
        });
      });
    },
    // Retrieves page data for the first result that matches given CQL query.
    getPageByCQL(baseUrl: any, auth: any, query: any, cb: any) {
      const opts = {
        qs: {
          cql: query,
          expand: 'body.view',
          limit: 1,
        },
        url: baseUrl + '/rest/experimental/content',
      };
      addAuthConfig(auth, opts);

      jobWorker.dependencies.easyRequest.JSON(opts, (err: any, body: any) => {
        if (err) {
          return cb(err);
        }

        if (body.results.length === 0) {
          return cb(null, new Error('No page matching query ' + query));
        }

        const result = body.results[0];

        cb(null, {
          content: result.body.view.value,
          title: result.title,
          webLink: result._links.webui,
        });
      });
    },
  };
}
