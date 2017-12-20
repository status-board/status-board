/**
 * easyRequest
 * Provides a layer of abstraction to easily query HTTP endpoints.
 * It does all the error handling (bad response, authentication failed, bad json response, etc).
 */
import * as request from 'request';

function queryRequest(options: any, callback: any) {
  request(options, (err: any, response: any, body: any) => {
    let errMsg = null;

    if (err) {
      errMsg = err;
    } else if (!response) {
      errMsg = `bad response from ${options.url}`;
    } else if (response.statusCode !== 200) {
      errMsg = `bad statusCode: ${response.statusCode} from ${options.url}`;
    }

    callback(errMsg, body, response);
  });
}

export default function () {
  return {
    /**
     * Provides an abstraction over request to query HTTP endpoints
     * expecting the response in JSON format.
     */
    // tslint:disable-next-line function-name
    JSON(options: any, callback: any) {
      queryRequest(options, (err: any, body: any, response: any) => {
        let jsonBody;
        let errorMessage = err;
        try {
          jsonBody = JSON.parse(body);
        } catch (e) {
          if (!err) {
            errorMessage = 'invalid json response';
          }
        }
        callback(errorMessage, jsonBody, response);
      });
    },

    /**
     * Provides an abstraction over request to query HTTP endpoints
     * expecting the response in plain text or HTML format.
     */
    HTML: queryRequest,
  };
}
