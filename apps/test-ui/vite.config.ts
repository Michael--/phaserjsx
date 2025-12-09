import { iconGeneratorPlugin } from '@number10/phaserjsx/vite-plugin-icons'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

/**
 * Vite configuration for development app with monorepo source watching
 * Provides HMR dev server with direct source imports from @number10/phaserjsx
 */
export default defineConfig({
  plugins: [
    iconGeneratorPlugin({
      configPath: './icon-generator.config.ts',
    }) as any, // Type workaround for multiple Vite versions in pnpm
  ],
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      // Map @number10/phaserjsx to source files for instant HMR
      // Note: specific paths must come BEFORE general path
      '@number10/phaserjsx/jsx-dev-runtime': resolve(
        __dirname,
        '../../packages/ui/src/jsx-dev-runtime.ts'
      ),
      '@number10/phaserjsx/jsx-runtime': resolve(__dirname, '../../packages/ui/src/jsx-runtime.ts'),
      '@number10/phaserjsx/components/custom': resolve(
        __dirname,
        '../../packages/ui/src/components/custom/index.ts'
      ),
      '@number10/phaserjsx': resolve(__dirname, '../../packages/ui/src/index.ts'),
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
