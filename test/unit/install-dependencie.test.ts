import { installDependencie } from '../../src/install-dependencie';

describe('Install Dependencie', () => {
  test('Should match snapshot', () => {
    expect(installDependencie).toMatchSnapshot();
  });
});
