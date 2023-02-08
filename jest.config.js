module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.test.ts$": ["@swc/jest"],
  },
  testMatch: ["<rootDir>/src/**/__tests__/*.test.ts"],
};
