import * as pg from 'pg';

function query(connectionString: any, query: any, params: any, callback: any) {
  // handle case where params are omitted
  if (arguments.length === 3) {
    callback = params;
    params = [];
  }

  pg.connect(connectionString, (err: any, client: any, done: any) => {
    if (err) {
      console.error('Error connecting to postgreSQL:' + err);
      done();
      return callback(err);
    }
    client.query(query, params, (err: any, results: any) => {
      if (err) {
        console.error('Error executing postgreSQL query:' + err);
        done();
        return callback(err);
      }
      done();
      callback(null, results);
    });
  });
};

export default function () {
  return {
    pg,
    query,
  };
}
