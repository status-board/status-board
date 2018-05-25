import * as Chance from 'chance';
import * as fs from 'fs';

import { globalAuth } from '../../src/global-auth';

jest.mock('../../src/logger', () => {
  const errorMock = jest.fn();
  const warnMock = jest.fn();
  return {
    default: () => ({ error: errorMock, warn: warnMock }),
    error: errorMock,
    warn: warnMock,
  };
});

const chance = new Chance();
const globalAuthString = '{"stash":{"username":"${STASH_USER}","password":"${STASH_PASSWORD}"},"jira":{"username":"${JIRA_USER}","password":"${JIRA_PASSWORD}"}}';
let stashUsername;
let stashPassword;
let jiraUsername;
let jiraPassword;

describe('Globsl Auth', () => {
  beforeEach(() => {
    stashUsername = chance.string();
    stashPassword = chance.string();
    jiraUsername = chance.string();
    jiraPassword = chance.string();
    jest.spyOn(fs, 'readFileSync')
      .mockImplementation(() => Buffer.from(globalAuthString));
    process.env.STASH_USER = stashUsername;
    process.env.STASH_PASSWORD = stashPassword;
    process.env.JIRA_USER = jiraUsername;
    process.env.JIRA_PASSWORD = jiraPassword;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.STASH_USER;
    delete process.env.STASH_PASSWORD;
    delete process.env.JIRA_USER;
    delete process.env.JIRA_PASSWORD;
  });

  test('Should add the ENV varible to the auth object', () => {
    const auth = globalAuth('');
    expect(auth).toHaveProperty('stash.username', stashUsername);
    expect(auth).toHaveProperty('stash.password', stashPassword);
    expect(auth).toHaveProperty('jira.username', jiraUsername);
    expect(auth).toHaveProperty('jira.password', jiraPassword);
  });
});
