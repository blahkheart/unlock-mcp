import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'tests/', '**/*.test.ts', '**/*.d.ts'],
      include: ['src/**/*.ts']
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    setupFiles: ['tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});