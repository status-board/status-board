export interface IEventQueue {
  send: (id: string, data: any) => void;
}

/**
 * Event Queue
 *
 * @param io
 * @constructor
 */
export class EventQueue implements IEventQueue {
  private io: SocketIO.Server;
  private latestEvents: any;

  constructor(io: any) {
    this.io = io;
    this.latestEvents = {};

    io.on('connection', (socket: SocketIO.Socket) => {
      socket.on('resend', (data: any) => {
        if (this.latestEvents[data]) {
          socket.emit(data, this.latestEvents[data]);
        }
      });

      // broadcast logs
      socket.on('log', (data: any) => {
        socket.emit('client', data);
      });
    });
  }

  /**
   * Send widget data to clients
   * @param id
   * @param data
   */
  public send(id: string, data: any) {
    this.latestEvents[id] = data;
    // emit to widget
    this.io.emit(id, data);
    // emit to logger
    this.io.emit('client', { data, widgetId: id });
  }
}
