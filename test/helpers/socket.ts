import { SocketIO, Server } from 'mock-socket';

export class Server {
  constructor() {
    this.ioServer = new Server('http://localhost:8080');
    this.ioClient = new SocketIO('http://localhost:8080');
  }

  public getIoServer() {
    return this.ioServer;
  }

  public getIoClient() {
    return this.ioClient;
  }
}
