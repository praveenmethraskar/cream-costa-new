module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(@testing-library|react-hot-toast)/)"
  ],

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov"],
};
