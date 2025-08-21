import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/vitest.setup.ts'],
    exclude: [
      'e2e/**',
      'node_modules/**',
      'dist/**',
      '.git/**',
      '.idea/**',
      '.vscode/**',
    ],
  },
});
