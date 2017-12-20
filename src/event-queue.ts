/**
 * Event Queue
 *
 * @param io
 * @constructor
 */
export default function eventQueue(io: any) {
  this.io = io;
  this.latestEvents = {};

  io.on('connection', (socket: any) => {
    socket.on('resend', (data: any) => {
      if (this.latestEvents[data]) {
        socket.emit(data, this.latestEvents[data]);
      }
    });

    // broadcast logs
    socket.on('log', (data: any) => {
      socket.broadcast.emit('client', data);
    });
  });

  return {
    /**
     * Send widget data to clients
     * @param id
     * @param data
     */
    send: (id: any, data: any) => {
      this.latestEvents[id] = data;
      this.io.emit(id, data); // emit to widget
      this.io.emit('client', { data, widgetId: id }); // emit to logger
    },
  };
}
