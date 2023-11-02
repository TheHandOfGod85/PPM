const baseTestDir = '<rootDir>/src'
import type { Config } from 'jest'
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: [`${baseTestDir}/__tests__/**/*test.ts`],
}

export default config
