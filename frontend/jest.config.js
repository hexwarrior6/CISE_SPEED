module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|out|dist)[/\\\\]', '/.next/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/__mocks__/fileMock.js',
    'next/image': '<rootDir>/src/__mocks__/nextImageMock.js',
    'next/link': '<rootDir>/__mocks__/nextLink.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(tsx|ts)?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
    '^.+\\.(js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src',
  ],
};