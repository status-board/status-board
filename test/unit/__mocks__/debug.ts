'use strict';
const debugMock = jest.fn();
const bugMock = jest.fn(() => debugMock);

module.exports = jest.fn().mockImplementation(() => bugMock);
