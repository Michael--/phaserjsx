import { iconGeneratorPlugin } from '@number10/phaserjsx/vite-plugin-icons'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [
    iconGeneratorPlugin({
      configPath: './icon-generator.config.ts',
    }) as never, // Type workaround for multiple Vite versions
  ],
  server: {
    port: 5174,
    open: true,
  },
})
