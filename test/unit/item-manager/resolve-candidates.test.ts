import * as Chance from 'chance';
import { resolveCandidates } from '../../../src/item-manager';
import { system } from '../../helpers/chance-system';

const chance = new Chance();
chance.mixin(system);

describe('Item Manager: Resolve Candidates', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('return items that matches filter', () => {
    const firstName = `${chance.word()}-${chance.word()}`;
    const secondName = `${chance.word()}-${chance.word()}`;
    const thirdName = `${chance.word()}-${chance.word()}`;
    const forthName = `${chance.word()}-${chance.word()}`;
    const fifthName = `${chance.word()}-${chance.word()}`;
    const itemType = chance.pickone(['jobs', 'widgets']);
    const extension = chance.system.fileExt();
    const items = [
      `/packages/demo/${itemType}/${fifthName}/${fifthName}${extension}`,
      `/packages/demo/${itemType}/${forthName}/${forthName}${extension}`,
      `/packages/demo/${itemType}/${thirdName}/${thirdName}${extension}`,
      `/packages/demo/${itemType}/${secondName}/${secondName}${extension}`,
      `/packages/demo/${itemType}/${firstName}/${firstName}${extension}`,
    ];
    const expectedResults = [`/packages/demo/${itemType}/${thirdName}/${thirdName}${extension}`];

    const results = resolveCandidates(items, thirdName, itemType, extension);

    expect(results).toEqual(expectedResults);
  });

  test('return namesspaced items that matches filter', () => {
    const namespace = chance.word();
    const firstName = `${chance.word()}-${chance.word()}`;
    const secondName = `${chance.word()}-${chance.word()}`;
    const thirdName = `${chance.word()}-${chance.word()}`;
    const forthName = `${chance.word()}-${chance.word()}`;
    const fifthName = `${chance.word()}-${chance.word()}`;
    const itemType = chance.pickone(['jobs', 'widgets']);
    const extension = chance.system.fileExt();
    const items = [
      `/packages/${namespace}/${itemType}/${fifthName}/${fifthName}${extension}`,
      `/packages/${namespace}/${itemType}/${forthName}/${forthName}${extension}`,
      `/packages/${namespace}/${itemType}/${thirdName}/${thirdName}${extension}`,
      `/packages/${namespace}/${itemType}/${secondName}/${secondName}${extension}`,
      `/packages/${namespace}/${itemType}/${firstName}/${firstName}${extension}`,
    ];
    const expectedResults = [`/packages/${namespace}/${itemType}/${thirdName}/${thirdName}${extension}`];

    const results = resolveCandidates(items, `${namespace}#${thirdName}`, itemType, extension);

    expect(results).toEqual(expectedResults);
  });
});
