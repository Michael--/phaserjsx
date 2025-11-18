import { defineConfig } from 'vitest/config'

// Vitest configuration for unit tests
export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'threads',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.config.ts', '**/*.d.ts'],
    },
  },
})
