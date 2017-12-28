import * as io from 'socket.io';
import * as socketClient from 'socket.io-client';

export interface IServer {
  getIoServer: () => SocketIO.Server;
  getIoClient: () => SocketIOClient.Socket;
  stopServer: () => void;
}

export class Server implements IServer {
  private ioServer: SocketIO.Server;
  private ioClient: SocketIOClient.Socket;

  constructor() {
    this.ioServer = io();
    this.ioServer.listen(3000);
    this.ioClient = socketClient('http://localhost:3000', { reconnection: false });
  }

  public getIoServer() {
    return this.ioServer;
  }

  public getIoClient() {
    return this.ioClient;
  }

  public stopServer() {
    this.ioServer.close();
    this.ioClient.disconnect();
  }
}
