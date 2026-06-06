import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      // Keep this repro wired to local sources while debugging PhaserJSX clipping internals.
      '@number10/phaserjsx/jsx-dev-runtime': resolve(
        __dirname,
        '../../packages/ui/src/jsx-dev-runtime.ts'
      ),
      '@number10/phaserjsx/jsx-runtime': resolve(__dirname, '../../packages/ui/src/jsx-runtime.ts'),
      '@number10/phaserjsx': resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
    dedupe: ['phaser'],
  },
  server: {
    port: 5176,
    open: true,
  },
})
