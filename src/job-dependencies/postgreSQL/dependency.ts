import { Client } from 'pg';
import logger from '../../logger';

export default function (config: any) {
  const client = new Client(config);

  return {
    query: (connectionString: any, query: any, params: any, callback: any) => {
      client.connect((connectError) => {
        if (connectError) {
          logger().error(`Error connecting to postgreSQL: ${connectError.stack}`);
          callback(connectError);
        } else {
          client.query(connectionString, (queryError: any, results: any) => {
            if (queryError) {
              throw Error(`Error executing postgreSQL query: ${queryError}`);
            }
            client.end();
            callback(null, results);
          });
        }
      });
    },
  };
}
