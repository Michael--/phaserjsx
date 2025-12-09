/**
 * Vite plugin for automatic icon generation
 * Integrates icon generator into Vite's build pipeline
 *
 * Usage in vite.config.ts:
 *   import { iconGeneratorPlugin } from '@number10/phaserjsx/vite-plugin-icons'
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
import type { Plugin } from 'vite'
import type { IconGeneratorConfig } from './scripts/icon-generator-config'

export interface IconGeneratorPluginOptions {
  /** Path to icon generator config file */
  configPath: string

  /**
   * When to scan icon directories and generate types
   * - 'never': Don't generate in plugin (use CLI manually)
   * - 'start': Only at server start (default)
   * - 'watch': At start + when SVG files change
   */
  scanIconDirectory?: 'never' | 'start' | 'watch'

  /**
   * When to scan code and generate loaders
   * - 'start': Only at server start
   * - 'watch': At start + when code changes (default)
   */
  generateLoaders?: 'start' | 'watch'

  /** @deprecated Use scanIconDirectory instead */
  watch?: boolean
  /** @deprecated Use scanIconDirectory='never' + generateLoaders='start' instead */
  typesOnly?: boolean
  /** @deprecated Use scanIconDirectory='start' instead */
  loadersOnly?: boolean
}

/**
 * Import generation functions dynamically to avoid circular deps
 */
async function loadGeneratorFunctions() {
  // Dynamic import to avoid bundling the entire generator
  // Import without extension - Vite/Node will resolve to .ts in dev, .js in prod
  const module = await import('./scripts/generate-icons')
  return {
    loadConfig: module.loadConfig,
    generateTypes: module.generateTypes,
    generateLoaders: module.generateLoaders,
    scanIconSources: module.scanIconSources,
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
        const { loadConfig } = await loadGeneratorFunctions()
        config = await loadConfig(options.configPath, root)

        // Apply deprecated option overrides
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

      // Determine scan mode: config-level > plugin-level > default
      const scanIconDirectory =
        config.types?.scanIconDirectory ?? options.scanIconDirectory ?? 'watch'

      // Determine loader generation mode: config-level > plugin-level > default
      const generateLoadersMode =
        config.loaders?.generateLoaders ?? options.generateLoaders ?? 'watch'

      // In build mode, always generate if enabled
      // In dev mode, only generate if mode is 'start'
      const shouldGenerateTypes = scanIconDirectory !== 'never' && config.types?.enabled
      const shouldGenerateLoaders =
        config.loaders?.enabled && (isDevMode ? generateLoadersMode === 'start' : true)

      if (!shouldGenerateTypes && !shouldGenerateLoaders) return

      console.log('🎨 [Icon Generator] Generating icons...')

      try {
        const { generateTypes, generateLoaders, scanIconSources } = await loadGeneratorFunctions()

        // Generate types first (if enabled)
        let typesResult = shouldGenerateTypes ? await generateTypes(config, root) : null

        // Generate loaders (pass types result for accurate source mapping)
        if (shouldGenerateLoaders) {
          // If types weren't generated but we need sourceIconSets, do lightweight scan
          if (!typesResult && config.types?.enabled) {
            typesResult = await scanIconSources(config, root)
          }
          await generateLoaders(config, root, typesResult || undefined)
        }

        console.log('✨ [Icon Generator] Done!')
      } catch (error) {
        this.error(`Icon Generator Plugin: ${error}`)
      }
    },

    async handleHotUpdate({ file, server }) {
      if (!isDevMode || !config || options.watch === false) return

      // Determine scan mode: config-level > plugin-level > default
      const scanIconDirectory =
        config.types?.scanIconDirectory ?? options.scanIconDirectory ?? 'watch'

      // Determine loader generation mode: config-level > plugin-level > default
      const generateLoadersMode =
        config.loaders?.generateLoaders ?? options.generateLoaders ?? 'watch'

      // Normalize paths for comparison (file is absolute, configs are relative)
      const scanDirAbs = config.loaders?.enabled ? resolve(root, config.loaders.scanDir) : null

      // Check if file is in scan directory (for loader regeneration)
      // Only regenerate if generateLoadersMode is 'watch'
      const shouldRegenerateLoaders =
        generateLoadersMode === 'watch' &&
        config.loaders?.enabled &&
        scanDirAbs &&
        file.startsWith(scanDirAbs) &&
        /\.(tsx?|jsx?)$/.test(file) &&
        !file.endsWith('.generated.ts')

      // Check if file is an SVG in any icon source directory
      // Only regenerate if scanIconDirectory is 'watch'
      const sources = Array.isArray(config.source) ? config.source : [config.source]
      const sourceAbsPaths = sources
        .filter((s) => s.directory)
        .map((s) => resolve(root, s.directory as string))

      const shouldRegenerateTypes =
        scanIconDirectory === 'watch' &&
        config.types?.enabled &&
        file.endsWith('.svg') &&
        sourceAbsPaths.some((path) => file.startsWith(path))

      if (shouldRegenerateLoaders || shouldRegenerateTypes) {
        console.log('🔄 [Icon Generator] File changed, regenerating...')

        try {
          const { generateTypes, generateLoaders, scanIconSources } = await loadGeneratorFunctions()

          // Generate types only when:
          // 1. SVG changed and scanIconDirectory is 'watch', OR
          // 2. Loaders need regeneration AND scanIconDirectory is 'watch'
          let typesResult = null
          if (shouldRegenerateTypes) {
            // SVG changed in watch mode
            typesResult = await generateTypes(config, root)
          } else if (shouldRegenerateLoaders && config.types?.enabled) {
            // Code changed, we need sourceIconSets for accurate loader generation
            if (scanIconDirectory === 'watch') {
              // Full regeneration including type file
              typesResult = await generateTypes(config, root)
            } else {
              // Lightweight scan without writing type file (scanIconDirectory is 'start')
              typesResult = await scanIconSources(config, root)
            }
          }

          // Generate loaders if needed (pass types result for accurate source mapping)
          if (shouldRegenerateLoaders) {
            await generateLoaders(config, root, typesResult || undefined)
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
