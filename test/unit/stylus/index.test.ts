import * as Chance from 'chance';
import * as nib from 'nib';
import * as realStylus from 'stylus';
import { noop } from '../../../src/helpers';
import { stylus } from '../../../src/stylus';
import * as getStylusObject from '../../../src/stylus/get-stylus-object';

jest.mock('nib', () => jest.fn(() => 'nib'));

const chance = new Chance();
const stylusObject = {
  render: jest.fn((cb: any) => cb(null, 'stylusObject', 'render')),
  set: jest.fn(() => stylusObject),
  use: jest.fn(noop),
};

let compileString: string;
let compileFilePath: string;

describe('Stylus', () => {
  beforeEach(() => {
    compileString = chance.string();
    compileFilePath = chance.string();
    jest.spyOn(getStylusObject, 'getStylusObject')
      .mockImplementation(() => stylusObject);
    jest.spyOn(realStylus, 'middleware')
      .mockImplementation((options: any) => options.compile(compileString, compileFilePath));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getMiddleware', () => {
    const options = {
      dest: chance.string(),
      src: chance.string(),
    };

    const middleware = stylus.getMiddleware(options);

    expect(realStylus.middleware).toHaveBeenCalledWith({
      compile: expect.any(Function),
      dest: options.dest,
      src: options.src,
    });
    expect(getStylusObject.getStylusObject).toHaveBeenCalledWith(compileString);
    expect(stylusObject.set).toHaveBeenCalledWith('filename', compileFilePath);
    expect(stylusObject.set).toHaveBeenCalledWith('warn', false);
    expect(stylusObject.set).toHaveBeenCalledWith('compress', true);
    expect(stylusObject.use).toHaveBeenCalledWith(nib());
    expect(middleware).toEqual(stylusObject);
  });

  test('getWidgetCSS', (done: () => void) => {
    const str = chance.string();
    const callback = (err: Error, css: string, js: string) => {
      expect(getStylusObject.getStylusObject)
        .toHaveBeenCalledWith(str);
      expect(stylusObject.render)
        .toHaveBeenCalledWith(callback);
      expect(err).toBeNull();
      expect(css).toEqual('stylusObject');
      expect(js).toEqual('render');
      done();
    };

    stylus.getWidgetCSS(str, callback);
  });
});
