/**
 * Event Queue
 *
 * @param io
 * @constructor
 */
function EventQueue(io) {
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

exports = module.exports = EventQueue;

/**
 * Send widget data to clients
 * @param id
 * @param data
 */
EventQueue.prototype.send = function (id: any, data: any) {
  this.latestEvents[id] = data;
  this.io.emit(id, data); // emit to widget
  this.io.emit('client', { data, widgetId: id }); // emit to logger
};
