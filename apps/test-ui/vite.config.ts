import { defineConfig } from 'vite';

// Vite configuration for development app
// Provides HMR dev server for testing @phaserjsx/ui
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
});
