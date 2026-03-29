const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    include: ['services/**/*.test.js', '../database/services/**/*.test.js'],
    globals: true,
    exclude: ['node_modules/**', '../node_modules/**'],
  },
});
