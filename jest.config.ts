import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.service.ts',
      'src/**/*.controller.ts'
    ],
    coverageProvider: 'v8',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    testRegex: "/__tests__/.*\\.test\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    coverageDirectory: "/coverage"
};

export default config;