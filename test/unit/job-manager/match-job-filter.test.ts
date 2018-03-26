import * as Chance from 'chance';
import { matchJobFilter } from '../../../src/job-manager/match-job-filter';

const chance = new Chance();

let jobName: string;
let job: string;

describe('Job Manager: Match Job Filter', () => {
  beforeEach(() => {
    jobName = chance.word().toLocaleLowerCase();
    job = `picture-${jobName}-day`;
  });

  test('should match dashboard using string', () => {
    const filter = `-${jobName}`;

    const match = matchJobFilter(job, filter);

    expect(match.index).toEqual(7);
    expect(match.input).toEqual(`picture-${jobName}-day`);
    expect(match).toContainEqual(`-${jobName}`);
  });

  test('should match dashboard using RegEx', () => {
    const filter = 'pic(.*)day';

    const match = matchJobFilter(job, filter);

    expect(match.index).toEqual(0);
    expect(match.input).toEqual(`picture-${jobName}-day`);
    expect(match).toEqual(expect.arrayContaining([
      `picture-${jobName}-day`,
      `ture-${jobName}-`,
    ]));
  });

  test('should return null with no match', () => {
    const filter = 'no_match';

    const match = matchJobFilter(job, filter);

    expect(match).toBeNull();
  });
});
