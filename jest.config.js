module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['<rootDir>/tests/env-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
}
