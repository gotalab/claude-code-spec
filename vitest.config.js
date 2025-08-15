import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.mjs', 'tests/**/*.test.js'],
    exclude: ['node_modules/**', 'dist/**', '.claude/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        '*.test.js',
        '*.test.mjs',
        '.claude/'
      ]
    }
  }
});
