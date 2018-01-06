export class MockedResponse {
  public mockedRender: any;
  public mockedStatus: any;
  public mockedType: any;
  public mockedEnd: any;
  public mockedSend: any;
  public mockedWrite: any;

  constructor() {
    this.mockedRender = jest.fn();
    this.mockedStatus = jest.fn();
    this.mockedType = jest.fn();
    this.mockedEnd = jest.fn();
    this.mockedSend = jest.fn();
    this.mockedWrite = jest.fn();
    return this;
  }

  public resetMocked() {
    this.mockedRender.mockReset();
    this.mockedStatus.mockReset();
    this.mockedType.mockReset();
    this.mockedEnd.mockReset();
    this.mockedSend.mockReset();
    this.mockedWrite.mockReset();
  }

  public render(view: string) {
    this.mockedRender(view);
  }

  public send(body?: any) {
    this.mockedSend(body);
  }

  public status(code: number) {
    this.mockedStatus(code);

    return {
      send: this.mockedSend,
    };
  }

  public type(type: string) {
    this.mockedType(type);
  }

  public write(data: string) {
    this.mockedWrite(data);
  }

  public end() {
    this.mockedEnd();
  }
}
