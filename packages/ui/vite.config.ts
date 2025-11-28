import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Vite configuration for library build
// Outputs ESM and CJS bundles with TypeScript declarations
export default defineConfig({
  esbuild: {
    jsxImportSource: '.',
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'jsx-runtime': resolve(__dirname, 'src/jsx-runtime.ts'),
        'jsx-dev-runtime': resolve(__dirname, 'src/jsx-dev-runtime.ts'),
        'components/custom/index': resolve(__dirname, 'src/components/custom/index.ts'),
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
    minify: false, // Don't minify to keep console.logs and readable code
    // Target modern browsers
    target: 'es2022',
  },
  plugins: [
    dts({
      rollupTypes: false,
      tsconfigPath: './tsconfig.json',
      // Ensure all types are properly exported
      insertTypesEntry: true,
    }),
  ],
})
