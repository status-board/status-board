import * as express from 'express';
import * as http from 'http';
import { listen } from 'socket.io';
import * as socketClient from 'socket.io-client';

export interface IServer {
  getIoServer: () => SocketIO.Server;
  getIoClient: () => SocketIOClient.Socket;
  stopServer: () => void;
}

export class Server implements IServer {
  private app: express.Application;
  private httpServer: http.Server;
  private ioServer: SocketIO.Server;
  private ioClient: SocketIOClient.Socket;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app).listen(3000);
    this.ioServer = listen(this.httpServer);
    this.ioClient = socketClient('http://0.0.0.0:3000', { reconnection: false });
  }

  public getIoServer() {
    return this.ioServer;
  }

  public getIoClient() {
    return this.ioClient;
  }

  public stopServer() {
    this.httpServer.close();
    this.ioClient.disconnect();
  }
}
