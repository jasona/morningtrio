/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'bundler',
        module: 'ESNext',
        target: 'ES2020',
        strict: true,
        skipLibCheck: true,
        paths: {
          '@/*': ['./src/*'],
        },
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|dexie|dexie-react-hooks|clsx|tailwind-merge)/)',
  ],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = config;
