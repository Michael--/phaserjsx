import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * Vite configuration for CLI scripts build
 * Compiles TypeScript scripts to executable JavaScript in dist/scripts/
 */
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: {
        'scripts/generate-icons': resolve(__dirname, 'src/scripts/generate-icons.ts'),
        'scripts/generate-icon-types': resolve(__dirname, 'src/scripts/generate-icon-types.ts'),
        'scripts/generate-icon-loaders': resolve(__dirname, 'src/scripts/generate-icon-loaders.ts'),
        'scripts/icon-generator-config': resolve(__dirname, 'src/scripts/icon-generator-config.ts'),
        'vite-plugin-icons': resolve(__dirname, 'src/vite-plugin-icons.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:fs/promises', 'node:path', 'node:util', 'node:url', 'vite'],
      output: {
        banner: (chunk) => {
          // Only add shebang to executable scripts
          if (chunk.name?.startsWith('scripts/generate-')) {
            return '#!/usr/bin/env node'
          }
          return ''
        },
      },
    },
    sourcemap: false,
    minify: false,
    target: 'node18',
  },
  plugins: [
    dts({
      include: ['src/scripts/icon-generator-config.ts', 'src/vite-plugin-icons.ts'],
      outDir: 'dist',
      // Suppress composite mode warnings
      compilerOptions: {
        composite: false,
      },
    }),
  ],
})
