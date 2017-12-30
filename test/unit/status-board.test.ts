import * as express from 'express';
import * as socket from 'socket.io';
import * as logger from '../../src/logger';
import * as server from '../../src/webapp/server';

import { init } from '../../src/job-initialiser';

import statusBoard from '../../src/status-board';

const packagesFolder = '/packages';

jest.mock('../../src/job-initialiser.ts', () => {
  return {init: jest.fn(),
  };
});
jest.mock('express');
jest.mock('../../src/webapp/server',() => {
  return { default: jest.fn() };
});

describe('Staus Board', () => {
  describe('Install Dependencies', () => {
    beforeEach(() => {
      jest.unmock('../../src/package-dependency-manager');
    });

    test('Should return error', () => {
      const pdm = require.requireActual('../../src/package-dependency-manager');
      pdm.installDependencies = jest.fn((path, cb) => {
        return cb(Error('ERROR'));
      });
      const options = { port:'0000', install:true };
      function callback(error) {
        expect(error).toEqual(Error('ERROR'));
      }

      statusBoard(options, callback);

      expect(pdm.installDependencies).toHaveBeenCalled();
      expect(pdm.installDependencies).toHaveBeenCalledWith(
        expect.stringMatching('packages'), expect.anything());
      expect(init).toHaveBeenCalled();
    });

    test('Should print message', () => {
      const pdm = require.requireActual('../../src/package-dependency-manager');
      pdm.installDependencies = jest.fn((path, cb) => {
        cb(null);
      });

      function callback(error) {
        expect(error).toBeUndefined();
      }

      const options = { port:'0000', install:true };

      statusBoard(options, callback);

      expect(pdm.installDependencies).toHaveBeenCalled();
      expect(pdm.installDependencies).toHaveBeenCalledWith(
        expect.stringMatching('packages'), expect.anything());
      expect(init).toHaveBeenCalled();
    });

    test('Should not install dependencies', () => {
      const pdm = require.requireActual('../../src/package-dependency-manager');
      pdm.installDependencies = jest.fn((path, cb) => {
        cb(null);
      });

      function callback(error) {
        expect(error).toBeUndefined();
      }

      const options = { port:'0000', install:false };

      statusBoard(options, callback);

      expect(pdm.installDependencies).not.toHaveBeenCalled();
      expect(init).toHaveBeenCalled();
    });
  });

  describe('Initiate Jobs', () => {
    beforeEach(() => {
      jest.unmock('socket.io');
    });

    test('Should emit server information', () => {
      const socketIO = require.requireActual('socket.io');
      const socketListernerMock = jest.fn();
      const onMock = jest.fn();
      function callback(error) {
        expect(error).toBeUndefined();
      }
      socketIO.listen = jest.fn(() => {
        return { on: onMock ,
        };
      });
      const options = { port:'0000', install:true };

      statusBoard(options, callback);

      expect(socketIO.listen).toHaveBeenCalled();
      expect(onMock).toHaveBeenCalled();
      expect(onMock).toHaveBeenCalledWith('connection', expect.anything());
      expect(init).toHaveBeenCalled();
    });
  });

});
