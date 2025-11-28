/**
 * Vite plugin for automatic icon generation
 * Integrates icon generator into Vite's build pipeline
 *
 * Usage in vite.config.ts:
 *   import { iconGeneratorPlugin } from '@phaserjsx/ui/vite-plugin-icons'
 *
 *   export default defineConfig({
 *     plugins: [
 *       iconGeneratorPlugin({
 *         configPath: './icon-generator.config.ts',
 *         watch: true, // Enable in dev mode
 *       })
 *     ]
 *   })
 */
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Plugin } from 'vite'
import type { IconGeneratorConfig } from './scripts/icon-generator-config'

export interface IconGeneratorPluginOptions {
  /** Path to icon generator config file */
  configPath: string
  /** Enable watch mode in dev (default: true) */
  watch?: boolean
  /** Generate only types */
  typesOnly?: boolean
  /** Generate only loaders */
  loadersOnly?: boolean
}

/**
 * Load config file
 */
async function loadConfig(configPath: string, root: string): Promise<IconGeneratorConfig> {
  const absolutePath = resolve(root, configPath)
  const fileUrl = pathToFileURL(absolutePath).href

  try {
    const module = await import(fileUrl)
    return module.default || module
  } catch (error) {
    throw new Error(`Failed to load icon config from ${configPath}: ${error}`)
  }
}

/**
 * Import generation functions dynamically to avoid circular deps
 */
async function loadGeneratorFunctions() {
  // Dynamic import to avoid bundling the entire generator
  // Import without extension - Vite/Node will resolve to .ts in dev, .js in prod
  const module = await import('./scripts/generate-icons')
  return {
    generateTypes: module.generateTypes,
    generateLoaders: module.generateLoaders,
  }
}

/**
 * Vite plugin for icon generation
 */
export function iconGeneratorPlugin(options: IconGeneratorPluginOptions): Plugin {
  let config: IconGeneratorConfig
  let root: string
  let isDevMode = false

  return {
    name: 'vite-plugin-icon-generator',

    async configResolved(resolvedConfig) {
      root = resolvedConfig.root
      isDevMode = resolvedConfig.command === 'serve'

      try {
        config = await loadConfig(options.configPath, root)

        // Apply CLI-style overrides
        if (options.typesOnly && config.loaders) {
          config = { ...config, loaders: { ...config.loaders, enabled: false } }
        }
        if (options.loadersOnly && config.types) {
          config = { ...config, types: { ...config.types, enabled: false } }
        }
      } catch (error) {
        this.error(`Icon Generator Plugin: ${error}`)
      }
    },

    async buildStart() {
      if (!config) return

      console.log('🎨 [Icon Generator] Generating icons...')

      try {
        const { generateTypes, generateLoaders } = await loadGeneratorFunctions()

        // Generate types first
        const iconNames = config.types?.enabled ? await generateTypes(config, root) : null

        // Generate loaders
        if (config.loaders?.enabled) {
          await generateLoaders(config, root, iconNames || undefined)
        }

        console.log('✨ [Icon Generator] Done!')
      } catch (error) {
        this.error(`Icon Generator Plugin: ${error}`)
      }
    },

    async handleHotUpdate({ file, server }) {
      if (!isDevMode || !config || options.watch === false) return

      // Check if file is in scan directory (for loader regeneration)
      const shouldRegenerateLoaders =
        config.loaders?.enabled &&
        file.includes(config.loaders.scanDir) &&
        /\.(tsx?|jsx?)$/.test(file) &&
        !file.endsWith('.generated.ts')

      // Check if file is an SVG in any icon source directory
      const sources = Array.isArray(config.source) ? config.source : [config.source]
      const shouldRegenerateTypes =
        config.types?.enabled &&
        file.endsWith('.svg') &&
        sources.some((source) => source.directory && file.includes(source.directory))

      if (shouldRegenerateLoaders || shouldRegenerateTypes) {
        console.log('🔄 [Icon Generator] File changed, regenerating...')

        try {
          const { generateTypes, generateLoaders } = await loadGeneratorFunctions()

          if (shouldRegenerateTypes) {
            await generateTypes(config, root)
          }

          if (shouldRegenerateLoaders) {
            const iconNames = config.types?.enabled ? await generateTypes(config, root) : null
            await generateLoaders(config, root, iconNames || undefined)
          }

          console.log('✅ [Icon Generator] Regenerated')

          // Trigger full reload for generated files
          server.ws.send({
            type: 'full-reload',
            path: '*',
          })
        } catch (error) {
          console.error('❌ [Icon Generator] Error:', error)
        }
      }
    },
  }
}
