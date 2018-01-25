import { Request } from './request';
import { Response } from './response';

export class Express {
  public mockedGet: any;
  public mockedRoute: any;
  public mockedSet: any;
  public mockedUse: any;
  public mockedRequest: any;
  public mockedResponse: any;

  constructor() {
    this.mockedRequest = new Request();
    this.mockedResponse = new Response();
    this.mockedGet = jest.fn((callback: any) => {
      callback(this.mockedRequest, this.mockedResponse);
    });
    this.mockedRoute = jest.fn();
    this.mockedSet = jest.fn();
    this.mockedUse = jest.fn();
    return this;
  }

  public resetMocked() {
    this.mockedGet.mockReset();
    this.mockedRoute.mockReset();
    this.mockedSet.mockReset();
    this.mockedUse.mockReset();
  }

  public get(callback: any) {
    this.mockedGet(callback);
  }

  public set(view: string) {
    this.mockedSet(view);
  }

  public use(view: string) {
    this.mockedUse(view);
  }

  public route(prefix: string) {
    this.mockedRoute(prefix);

    return {
      get: this.mockedGet,
    };
  }
}
