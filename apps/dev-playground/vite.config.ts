import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 5174,
    open: true,
  },
})
