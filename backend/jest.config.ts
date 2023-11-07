const baseTestDir = '<rootDir>/src'
import type { Config } from 'jest'
const config: Config = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: [`${baseTestDir}/__tests__/**/*test.ts`],
}

export default config
