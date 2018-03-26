import * as Chance from 'chance';
import { matchDashboardFilter } from '../../../src/job-manager/match-dashboard-filter';

const chance = new Chance();

let first: string;
let last: string;
let dashboard: string;
let path: string;

describe('Job Manager: Match Dashboard Filter', () => {
  beforeEach(() => {
    first = chance.first().toLocaleLowerCase();
    last = chance.last().toLocaleLowerCase();
    dashboard = chance.word().toLocaleLowerCase();
    path = `/Users/${first}${last}/projects/status-board-example/packages/demo/dashboards/my${dashboard}_dashboard.json`;
  });

  test('should match dashboard using string', () => {
    const filter = `my${dashboard}`;

    const match = matchDashboardFilter(path, filter);

    expect(match.index).toEqual(0);
    expect(match.input).toEqual(`my${dashboard}_dashboard.json`);
    expect(match).toContainEqual(`my${dashboard}`);
  });

  test('should match dashboard using RegEx', () => {
    const filter = 'my(.*)board';

    const match = matchDashboardFilter(path, filter);

    expect(match.index).toEqual(0);
    expect(match.input).toEqual(`my${dashboard}_dashboard.json`);
    expect(match).toEqual(expect.arrayContaining([
      `my${dashboard}_dashboard`,
      `${dashboard}_dash`,
    ]));
  });

  test('should return null with no match', () => {
    const filter = 'no_match';

    const match = matchDashboardFilter(path, filter);

    expect(match).toBeNull();
  });
});
