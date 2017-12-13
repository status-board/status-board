/**
 * Event Queue
 *
 * @param io
 * @constructor
 */
export default function eventQueue(io) {
  this.io = io;
  this.latestEvents = {};
  const self = this;

  io.on('connection', (socket: any) => {
    socket.on('resend', (data: any) => {
      if (self.latestEvents[data]) {
        socket.emit(data, self.latestEvents[data]);
      }
    });

    // broadcast logs
    socket.on('log', (data: any) => {
      socket.broadcast.emit('client', data);
    });
  });
}

/**
 * Send widget data to clients
 * @param id
 * @param data
 */
eventQueue.prototype.send = function (id: any, data: any) {
  this.latestEvents[id] = data;
  this.io.emit(id, data); // emit to widget
  this.io.emit('client', { data, widgetId: id }); // emit to logger
};
