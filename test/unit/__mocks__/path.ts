import * as Chance from 'chance';

const chance = new Chance();
const path = jest.genMockFromModule('path');

function join() {
  return chance.string();
}

path.join = join;

module.exports = path;
