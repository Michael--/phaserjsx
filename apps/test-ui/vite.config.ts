import { resolve } from 'node:path'
import { defineConfig } from 'vite'

/**
 * Vite configuration for development app with monorepo source watching
 * Provides HMR dev server with direct source imports from @phaserjsx/ui
 */
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      // Map @phaserjsx/ui to source files for instant HMR
      // Note: specific paths must come BEFORE general path
      '@phaserjsx/ui/jsx-dev-runtime': resolve(
        __dirname,
        '../../packages/ui/src/jsx-dev-runtime.ts'
      ),
      '@phaserjsx/ui/jsx-runtime': resolve(__dirname, '../../packages/ui/src/jsx-runtime.ts'),
      '@phaserjsx/ui': resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split bootstrap icons into separate chunks for better tree-shaking
          if (id.includes('bootstrap-icons/icons/')) {
            const iconName = id.match(/icons\/([^.]+)\.svg/)?.[1]
            return iconName ? `icons/${iconName}` : undefined
          }
        },
      },
    },
  },
})
