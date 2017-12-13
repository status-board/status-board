/**
 * easyRequest
 * Provides a layer of abstraction to easily query HTTP endpoints.
 * It does all the error handling (bad response, authentication failed, bad json response, etc).
 */
import * as request from 'request';

function queryRequest(options: any, callback: any) {
  request(options, (err: any, response: any, body: any) => {
    let errMsg = null;
    if (err || !response || response.statusCode !== 200) {
      errMsg = (err || (response ? ('bad statusCode: ' + response.statusCode) : 'bad response')) + ' from ' + options.url;
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
    JSON(options: any, callback: any) {
      queryRequest(options, (err: any, body: any, response: any) => {
        let jsonBody;
        try {
          jsonBody = JSON.parse(body);
        } catch (e) {
          if (!err) {
            err = 'invalid json response';
          }
        }
        callback(err, jsonBody, response);
      });
    },

    /**
     * Provides an abstraction over request to query HTTP endpoints
     * expecting the response in plain text or HTML format.
     */
    HTML: queryRequest,
  };
}
