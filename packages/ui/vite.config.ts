import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Vite configuration for library build
// Outputs ESM and CJS bundles with TypeScript declarations
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'jsx-runtime': resolve(__dirname, 'src/jsx-runtime.ts'),
        'jsx-dev-runtime': resolve(__dirname, 'src/jsx-dev-runtime.ts'),
      },
      name: 'PhaserJSX',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
      },
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['phaser', '@preact/signals-core'],
      output: {
        // Provide global variables for UMD build
        globals: {
          phaser: 'Phaser',
        },
      },
    },
    sourcemap: true,
    // Target modern browsers
    target: 'es2022',
  },
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
})
