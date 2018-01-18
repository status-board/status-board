module.exports = {
  "globals": {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  },
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testMatch": [
    "<rootDir>/test/**/*.(test|spec).(ts|tsx|js)"
  ],
  "testResultsProcessor": "./node_modules/jest-junit-reporter",
  coveragePathIgnorePatterns: ["<rootDir>/test/helpers/", "<rootDir>/node_modules/"],
  "clearMocks": true,
  "mapCoverage": true
};