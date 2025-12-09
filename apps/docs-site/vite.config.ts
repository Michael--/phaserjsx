import { iconGeneratorPlugin } from '@number10/phaserjsx/vite-plugin-icons'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/phaserjsx/' : '/',
  plugins: [
    react(),
    iconGeneratorPlugin({
      configPath: './icon-generator.config.ts',
    }) as never, // Type workaround for multiple Vite versions
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
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
