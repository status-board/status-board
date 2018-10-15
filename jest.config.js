module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/test/helpers/',
    '<rootDir>/node_modules/',
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsConfig: 'tsconfig.json',
    },
  },
  testMatch: [
    '<rootDir>/test/**/*.(test|spec).(ts|tsx|js)',
  ],
  preset: 'ts-jest',
}