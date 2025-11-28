import { resolve } from 'node:path'
import { defineConfig } from 'vite'

/**
 * Vite configuration for CLI scripts build
 * Compiles TypeScript scripts to executable JavaScript in dist/scripts/
 */
export default defineConfig({
  build: {
    outDir: 'dist/scripts',
    emptyOutDir: true,
    lib: {
      entry: {
        'generate-icon-types': resolve(__dirname, 'src/scripts/generate-icon-types.ts'),
        'generate-icon-loaders': resolve(__dirname, 'src/scripts/generate-icon-loaders.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:fs/promises', 'node:path', 'node:util'],
      output: {
        banner: '#!/usr/bin/env node',
      },
    },
    sourcemap: false,
    minify: false,
    target: 'node18',
  },
})
