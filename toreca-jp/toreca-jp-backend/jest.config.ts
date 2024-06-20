/* eslint-disable */
export default {
  displayName: 'gacha-nicoras/gacha-nicoras-backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/gacha-nicoras/gacha-nicoras-backend',
};
