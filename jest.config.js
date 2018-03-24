module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/test/helpers/",
    "<rootDir>/node_modules/",
  ],
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json",
    }
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  testMatch: [
    "<rootDir>/test/**/*.(test|spec).(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
