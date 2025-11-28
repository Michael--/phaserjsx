import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

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
        'generate-icons': resolve(__dirname, 'src/scripts/generate-icons.ts'),
        'generate-icon-types': resolve(__dirname, 'src/scripts/generate-icon-types.ts'),
        'generate-icon-loaders': resolve(__dirname, 'src/scripts/generate-icon-loaders.ts'),
        'icon-generator-config': resolve(__dirname, 'src/scripts/icon-generator-config.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:fs/promises', 'node:path', 'node:util', 'node:url'],
      output: {
        banner: '#!/usr/bin/env node',
      },
    },
    sourcemap: false,
    minify: false,
    target: 'node18',
  },
  plugins: [
    dts({
      include: ['src/scripts/icon-generator-config.ts'],
      outDir: 'dist/scripts',
    }),
  ],
})
