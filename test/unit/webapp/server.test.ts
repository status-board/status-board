import { server } from '../../../src/webapp/server';

describe('Webapp: Server', () => {
  test('Should match snapshot', () => {
    expect(server).toMatchSnapshot();
  });
});
