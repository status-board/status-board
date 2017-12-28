import * as Chance from 'chance';
import { EventQueue } from '../../src/EventQueue';
import { IServer, Server } from '../helpers/socket';

const chance = new Chance();
let server: IServer;
let ioServer: SocketIO.Server;

const expectedId: string = chance.string();
const expectedData: any = {};
expectedData[chance.string()] = chance.string();

describe('Event Queue', () => {
  beforeEach(() => {
    server = new Server();
  });
  afterEach(() => {
    server.stopServer();
  });
  test('Test', () => {
    ioServer = server.getIoServer();
    const spyOn = jest.spyOn(ioServer, 'on');
    const spyEmit = jest.spyOn(ioServer, 'emit');
    const instance = new EventQueue(ioServer);

    instance.send(expectedId, expectedData);

    expect(spyOn).toHaveBeenCalledTimes(1);
    expect(spyOn).toHaveBeenCalledWith('connection', expect.anything());
    expect(spyEmit).toHaveBeenCalledTimes(2);
    expect(spyEmit).toHaveBeenCalledWith(expectedId, expectedData);
    expect(spyEmit).toHaveBeenCalledWith('client', { data: expectedData, widgetId: expectedId });
  });
});
