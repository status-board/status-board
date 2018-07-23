import * as Chance from 'chance';
import { Server, SocketIO } from 'mock-socket';

import { EventQueue, IEventQueue } from '../../src/EventQueue';

let server: Server;
let ioClient: SocketIO;
let instance: IEventQueue;

const chance = new Chance();
const expectedId: string = chance.string();
const expectedData: any = {};
expectedData[chance.string()] = chance.string();

describe('Event Queue', () => {
  const fakeURL = 'ws://localhost:8080';

  beforeAll(() => {
    server = new Server(fakeURL);
    ioClient = new SocketIO(fakeURL);
    instance = new EventQueue(ioClient);
  });

  afterAll((done: any) => {
    jest.restoreAllMocks();
    server.stop(() => done());
  });

  test('Should call emit with the correct events when send is called', () => {
    jest.spyOn(server, 'on');
    jest.spyOn(server, 'emit');
    instance = new EventQueue(server);

    instance.send(expectedId, expectedData);

    expect(server.on).toHaveBeenCalledTimes(1);
    expect(server.on).toHaveBeenCalledWith('connection', expect.anything());
    expect(server.emit).toHaveBeenCalledTimes(2);
    expect(server.emit).toHaveBeenCalledWith(expectedId, expectedData);
    expect(server.emit).toHaveBeenCalledWith('client', { data: expectedData, widgetId: expectedId });
  });

  test.skip('Server should broadcast the correct events to the client', (done: any) => {
    ioClient.on('connect', () => {
      ioClient.on('client', (data: any) => {
        expect(data).toEqual({ data: expectedData, widgetId: expectedId });
        done();
      });
      ioClient.on(expectedId, (data: any) => {
        expect(data).toEqual(expectedData);
        done();
      });
      instance.send(expectedId, expectedData);
    });
  });

  test.skip('Server should call emit with the client event when the client emits a log', (done: any) => {
    ioClient.on('client', (data: any) => {
      expect(data).toEqual({ data: expectedData, widgetId: expectedId });
      done();
    });
    ioClient.emit('log', { widgetId: expectedId, data: expectedData });
  });

  test.skip('Server should call emit with the id event when the client emits a resend', (done: any) => {
    let calledOnce: boolean;
    ioClient.on(expectedId, (data: any) => {
      if (calledOnce) {
        expect(data).toEqual(expectedData);
        done();
      }
      calledOnce = true;
    });
    instance.send(expectedId, expectedData);
    ioClient.emit('resend', expectedId);
  });
});
