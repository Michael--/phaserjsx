/**
 * Unified icon generator
 * Can generate types and/or loaders based on configuration
 *
 * Usage:
 *   generate-icons --config ./icon-generator.config.ts
 *   generate-icons --types-only
 *   generate-icons --loaders-only
 *   generate-icons --config ./icon-generator.config.ts --watch
 */
import { watch } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import type { IconGeneratorConfig } from './icon-generator-config'

/**
 * Find icon package in node_modules
 */
async function findIconPackage(packageName: string, cwd: string): Promise<string> {
  const fs = await import('node:fs')

  // Try pnpm structure first
  const pnpmBase = join(cwd, 'node_modules/.pnpm')
  if (fs.existsSync(pnpmBase)) {
    const entries = await readdir(pnpmBase)
    for (const entry of entries) {
      if (entry.startsWith(`${packageName}@`)) {
        const packagePath = join(pnpmBase, entry, 'node_modules', packageName)
        if (fs.existsSync(packagePath)) {
          return packagePath
        }
      }
    }
  }

  // Try standard node_modules
  const standardPath = join(cwd, 'node_modules', packageName)
  if (fs.existsSync(standardPath)) {
    return standardPath
  }

  throw new Error(`Could not find package: ${packageName}`)
}

/**
 * Recursively find all TypeScript files
 */
async function findTsFiles(dir: string, exclude: string[] = []): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    // Check exclude patterns
    if (exclude.some((pattern) => fullPath.includes(pattern))) continue

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      files.push(...(await findTsFiles(fullPath, exclude)))
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract icon names from file content
 */
function extractIconNames(
  content: string,
  componentNames: string[],
  customPatterns?: Array<{ pattern: string; captureGroup: number }>
): Set<string> {
  const iconNames = new Set<string>()
  let match: RegExpExecArray | null

  // Built-in patterns: <Icon type="icon-name" />
  for (const componentName of componentNames) {
    const typePattern = new RegExp(
      `<${componentName}\\s+[^>]*type=(?:["']([^"']+)["']|\\{["']([^"']+)["']\\})`,
      'g'
    )

    while ((match = typePattern.exec(content)) !== null) {
      const iconName = match[1] || match[2]
      if (iconName) {
        iconNames.add(iconName)
      }
    }
  }

  // Built-in pattern: themed.xxxIcon ?? 'icon-name'
  const themedPattern = /themed\.(\w*[Ii]con)\s*\?\?\s*["']([^"']+)["']/g
  while ((match = themedPattern.exec(content)) !== null) {
    if (match[2]) {
      iconNames.add(match[2])
    }
  }

  // Built-in pattern: icon: 'icon-name' in object literals
  const iconPropPattern = /(?:icon|iconType):\s*["']([^"']+)["']/g
  while ((match = iconPropPattern.exec(content)) !== null) {
    if (match[1]) {
      iconNames.add(match[1])
    }
  }

  // Custom patterns
  if (customPatterns) {
    for (const customPattern of customPatterns) {
      const pattern = new RegExp(customPattern.pattern, 'g')
      while ((match = pattern.exec(content)) !== null) {
        const iconName = match[customPattern.captureGroup]
        if (iconName) {
          iconNames.add(iconName)
        }
      }
    }
  }

  return iconNames
}

/**
 * Load available icons from types file
 */
async function loadAvailableIcons(typesFile: string): Promise<Set<string> | null> {
  try {
    const content = await readFile(typesFile, 'utf-8')
    const match = content.match(/(?:export\s+)?type\s+\w+\s*=\s*([\s\S]+?)(?=\n\nexport|\n\/\/|$)/s)
    if (!match?.[1]) return null

    const typeContent = match[1]
    const icons = new Set<string>()
    const iconPattern = /'([^']+)'/g
    let iconMatch: RegExpExecArray | null

    while ((iconMatch = iconPattern.exec(typeContent)) !== null) {
      const iconName = iconMatch[1]
      if (iconName) {
        icons.add(iconName)
      }
    }

    return icons
  } catch {
    return null
  }
}

/**
 * Generate icon types
 * Exported for use by Vite plugin
 */
export async function generateTypes(
  config: IconGeneratorConfig,
  cwd: string
): Promise<string[] | null> {
  if (!config.types?.enabled) return null

  console.log('\n📝 Generating icon types...')

  // Normalize source to array
  const sources = Array.isArray(config.source) ? config.source : [config.source]
  const allIconNames: string[] = []
  const sourceInfos: Array<{ name: string; count: number }> = []

  // Collect icons from all sources
  for (const source of sources) {
    let iconsDir: string
    let sourceName: string

    if (source.directory) {
      iconsDir = resolve(cwd, source.directory)
      sourceName = source.label || source.directory
      console.log(`📁 Scanning directory: ${source.directory}`)
    } else if (source.package) {
      const packagePath = await findIconPackage(source.package, cwd)
      iconsDir = join(packagePath, source.iconsPath || 'icons')
      sourceName = source.label || source.package
      console.log(`📦 Scanning package: ${source.package}`)
    } else {
      throw new Error('Either source.package or source.directory must be specified')
    }

    const files = await readdir(iconsDir)
    const iconNames = files
      .filter((file: string) => file.endsWith('.svg'))
      .map((file: string) => basename(file, '.svg'))

    console.log(`✓ Found ${iconNames.length} icons from ${sourceName}`)
    allIconNames.push(...iconNames)
    sourceInfos.push({ name: sourceName, count: iconNames.length })
  }

  // Remove duplicates and sort
  const uniqueIconNames = [...new Set(allIconNames)].sort()
  console.log(`✓ Total unique icons: ${uniqueIconNames.length}`)

  const typeDefinition = uniqueIconNames.map((name: string) => `  | '${name}'`).join('\n')
  const typeName = config.types.typeName || 'IconType'

  // Build source info string
  const sourceList =
    sourceInfos.length === 1 && sourceInfos[0]
      ? sourceInfos[0].name
      : sourceInfos.map((s) => `${s.name} (${s.count})`).join(', ')

  const output = `/**
 * Auto-generated icon type definitions
 * Sources: ${sourceList}
 * Total unique icons: ${uniqueIconNames.length}
 *
 * @generated by @phaserjsx/ui/generate-icons
 * @cspell: disable
 */

/**
 * All available icon names
 * Type-only definition - no runtime imports, zero bundle impact
 */
export type ${typeName} =
${typeDefinition}
`

  const outputPath = resolve(cwd, config.types.output)
  await writeFile(outputPath, output, 'utf-8')

  console.log(`✓ Generated: ${outputPath}`)
  console.log(`✓ Type name: ${typeName}`)

  return uniqueIconNames
}

/**
 * Generate icon loaders
 * Exported for use by Vite plugin
 */
export async function generateLoaders(
  config: IconGeneratorConfig,
  cwd: string,
  availableIcons?: string[]
): Promise<void> {
  if (!config.loaders?.enabled) return

  console.log('\n⚡ Generating icon loaders...')

  const scanDir = resolve(cwd, config.loaders.scanDir)
  const componentNames = config.loaders.componentNames || ['Icon']

  console.log(`📁 Scanning directory: ${scanDir}`)
  console.log(`🔍 Looking for components: ${componentNames.join(', ')}`)

  // Load available icons for validation if requested
  let availableIconsSet: Set<string> | null = null
  if (config.loaders.validate && config.types?.output) {
    const typesPath = resolve(cwd, config.types.output)
    availableIconsSet = await loadAvailableIcons(typesPath)
    if (availableIconsSet) {
      console.log(`✓ Loaded ${availableIconsSet.size} available icons for validation`)
    }
  } else if (availableIcons) {
    availableIconsSet = new Set(availableIcons)
  }

  const files = await findTsFiles(scanDir, config.exclude)
  console.log(`📄 Found ${files.length} TypeScript files`)

  const allIconNames = new Set<string>()

  for (const file of files) {
    const content = await readFile(file, 'utf-8')
    const icons = extractIconNames(content, componentNames, config.customPatterns)
    icons.forEach((icon) => allIconNames.add(icon))
  }

  let iconArray = Array.from(allIconNames).sort()

  // Validate against available icons
  if (availableIconsSet) {
    const invalidIcons = iconArray.filter((icon) => !availableIconsSet.has(icon))
    if (invalidIcons.length > 0) {
      console.warn(`⚠️  Found ${invalidIcons.length} icons not in types file:`)
      console.warn(
        `   ${invalidIcons.slice(0, 5).join(', ')}${invalidIcons.length > 5 ? '...' : ''}`
      )
    }
    iconArray = iconArray.filter((icon) => availableIconsSet.has(icon))
  }

  console.log(`✓ Found ${iconArray.length} unique icons`)

  if (iconArray.length > 0) {
    console.log(
      `  Icons: ${iconArray.slice(0, 10).join(', ')}${iconArray.length > 10 ? '...' : ''}`
    )
  }

  // Normalize source to array
  const sources = Array.isArray(config.source) ? config.source : [config.source]

  // Generate loaders for each source
  const loaderEntries: string[] = []
  for (const source of sources) {
    if (source.package) {
      const packageName = source.package
      const iconsPath = source.iconsPath || 'icons'
      // Only generate loaders for icons from this package
      loaderEntries.push(
        ...iconArray.map(
          (icon) =>
            `  '${icon}': () => import('${packageName}/${iconsPath}/${icon}.svg' as string),`
        )
      )
    } else if (source.directory) {
      // For local directories, use relative imports
      const dirPath = source.directory
      loaderEntries.push(
        ...iconArray.map((icon) => `  '${icon}': () => import('${dirPath}/${icon}.svg'),`)
      )
    }
  }

  const loaders = loaderEntries.join('\n')

  const outputContent = `/**
 * Auto-generated icon loaders
 * Generated by scanning: ${config.loaders.scanDir}
 *
 * @generated by @phaserjsx/ui/generate-icons
 */
export type IconLoaderFn = () => Promise<{ default: string }>

export const iconLoaders: Record<string, IconLoaderFn> = {
${loaders}
}
`

  const outputPath = resolve(cwd, config.loaders.output)
  await writeFile(outputPath, outputContent, 'utf-8')

  console.log(`✓ Generated: ${outputPath}`)
  console.log(`✓ Registered ${iconArray.length} icon loaders`)
}

/**
 * Load config file
 */
async function loadConfig(configPath: string): Promise<IconGeneratorConfig> {
  const absolutePath = resolve(process.cwd(), configPath)
  const fileUrl = pathToFileURL(absolutePath).href

  try {
    const module = await import(fileUrl)
    return module.default || module
  } catch (error) {
    throw new Error(`Failed to load config from ${configPath}: ${error}`)
  }
}

/**
 * Run generation with config
 */
async function runGeneration(config: IconGeneratorConfig, cwd: string): Promise<void> {
  console.log('🎨 Icon Generator')
  console.log('─'.repeat(50))

  // Generate types first (so loaders can validate against them)
  const iconNames = await generateTypes(config, cwd)

  // Generate loaders
  await generateLoaders(config, cwd, iconNames || undefined)

  console.log('\n✨ Done!\n')
}

/**
 * Watch mode - monitor files and regenerate on changes
 */
async function watchMode(config: IconGeneratorConfig, cwd: string): Promise<void> {
  console.log('👁️  Watch mode enabled')
  console.log('📁 Monitoring for changes...\n')

  // Initial generation
  await runGeneration(config, cwd)

  const watchDirs = new Set<string>()

  // Watch source directory if loaders enabled
  if (config.loaders?.enabled) {
    const scanDir = resolve(cwd, config.loaders.scanDir)
    watchDirs.add(scanDir)
  }

  // Watch icon source directories
  const sources = Array.isArray(config.source) ? config.source : [config.source]
  for (const source of sources) {
    if (source.directory) {
      watchDirs.add(resolve(cwd, source.directory))
    }
  }

  let regenerateTimeout: NodeJS.Timeout | null = null

  const scheduleRegenerate = () => {
    if (regenerateTimeout) {
      clearTimeout(regenerateTimeout)
    }
    regenerateTimeout = setTimeout(async () => {
      console.log('\n🔄 Changes detected, regenerating...')
      try {
        await runGeneration(config, cwd)
      } catch (error) {
        console.error('❌ Error during regeneration:', error)
      }
    }, 300)
  }

  for (const dir of watchDirs) {
    const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return

      // Ignore generated files, node_modules, and dot files
      if (
        filename.includes('node_modules') ||
        filename.includes('.git') ||
        filename.endsWith('.generated.ts') ||
        filename.startsWith('.')
      ) {
        return
      }

      // Only watch for .ts, .tsx, .svg files
      if (/\.(tsx?|svg)$/.test(filename)) {
        console.log(`📝 ${eventType}: ${filename}`)
        scheduleRegenerate()
      }
    })

    watcher.on('error', (error) => {
      console.error(`❌ Watch error for ${dir}:`, error)
    })
  }

  console.log(`👀 Watching ${watchDirs.size} directories`)
  console.log('Press Ctrl+C to stop\n')

  // Keep process alive
  await new Promise(() => {})
}

/**
 * Main function
 */
async function main() {
  const { values } = parseArgs({
    options: {
      config: { type: 'string', short: 'c' },
      typesOnly: { type: 'boolean' },
      loadersOnly: { type: 'boolean' },
      watch: { type: 'boolean', short: 'w' },
      help: { type: 'boolean', short: 'h' },
    },
  })

  if (values.help) {
    console.log(`
Usage: generate-icons [options]

Options:
  -c, --config <path>     Path to config file (e.g., ./icon-generator.config.ts)
  --typesOnly             Only generate types (skip loaders)
  --loadersOnly           Only generate loaders (skip types)
  -h, --help              Show this help message

Config File Example:
  // icon-generator.config.ts
  import { defineIconConfig } from '@phaserjsx/ui/scripts/icon-generator-config'

  export default defineIconConfig({
    source: {
      package: 'bootstrap-icons',
      iconsPath: 'icons',
    },
    types: {
      enabled: true,
      output: './src/icon-types.generated.ts',
      typeName: 'IconType',
    },
    loaders: {
      enabled: true,
      output: './src/icon-loaders.generated.ts',
      scanDir: './src',
      componentNames: ['Icon', 'BootstrapIcon'],
      validate: true,
    },
  })

Examples:
  # Using config file
  generate-icons --config ./icon-generator.config.ts

  # Generate only types
  generate-icons --config ./icon-generator.config.ts --typesOnly

  # Generate only loaders
  generate-icons --config ./icon-generator.config.ts --loadersOnly

  # Watch mode - regenerate on file changes
  generate-icons --config ./icon-generator.config.ts --watch
`)
    process.exit(0)
  }

  if (!values.config) {
    console.error('❌ Error: --config is required')
    console.error('Run with --help for usage information')
    process.exit(1)
  }

  try {
    const cwd = process.cwd()
    let config = await loadConfig(values.config)

    // Apply CLI overrides
    if (values.typesOnly && config.loaders) {
      config = { ...config, loaders: { ...config.loaders, enabled: false } }
    }
    if (values.loadersOnly && config.types) {
      config = { ...config, types: { ...config.types, enabled: false } }
    }

    // Watch mode or single run
    if (values.watch) {
      await watchMode(config, cwd)
    } else {
      await runGeneration(config, cwd)
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Only run if executed directly (not imported as module)
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
