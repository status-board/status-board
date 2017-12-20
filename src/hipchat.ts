import * as qstring from 'querystring';
import logger from './logger';

const API_URL = 'https://api.hipchat.com/';
const errors: any = {
  400: 'Bad request. Please check your data',
  401: 'Unauthorized: API KEY not valid',
  403: 'You have exceeded the rate limit',
  404: 'Not found',
  406: 'You requested an invalid content type',
  500: 'Server Error',
  503: 'The method you requested is currently unavailable (due to maintenance or high load',
};

function onResponseBuilder(callback: any) {
  return (err: any, response: any, body: any) => {

    if (callback) {
      let errMsg = null;

      if (err || !response || response.statusCode !== 200) {
        errMsg = err;

        if (response && errors[response.statusCode]) {
          errMsg += ` ${errors[response.statusCode]}; ${body}`;
        }
      }
      callback(errMsg, response ? response.statusCode : null, body);
    }
  };
}

export function create(options: any) {
  const request = options.request || require('request');

  if (!options.api_key) {
    logger().error('api_key required');
  }

  return {
    /**
     * Push message to HipChat server
     * @param roomId id of the room (number)
     * @param from sender name
     * @param message body of the message
     * @param notify should trigger a room notification? values: 1,0
     * @param callback a callback to be executed when complete
     */
    message(roomId: any, from: any, message: any, notify: any, callback: any) {
      const postUrl = API_URL + 'v1/rooms/message?format=json&auth_token=' + options.api_key;
      const data = {
        from,
        message,
        notify,
        room_id: roomId,
      };

      request.post(
        {
          body: qstring.stringify(data),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          url: postUrl,
        },
        onResponseBuilder(callback),
      );
    },
    /**
     * Get a room info from hipchat
     * @param roomId id of the room (number)
     * @param callback a callback to be executed when complete
     */
    roomInfo(roomId: any, callback: any) {
      const postUrl = API_URL + 'v2/room/' + roomId + '?format=json&auth_token=' + options.api_key;
      request.get(
        {
          json: true,
          url: postUrl,
        },
        onResponseBuilder(callback),
      );
    },
  };
}
