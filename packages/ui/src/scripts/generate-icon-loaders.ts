/**
 * Auto-generates icon loader registry from actual icon usage in the codebase
 * Scans TSX/TS files for Icon component usage and generates loaders
 *
 * Usage:
 *   generate-icon-loaders --source ./src --output ./src/components/icon-loaders.generated.ts --package bootstrap-icons
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

interface Options {
  source: string
  output: string
  package: string
  iconsPath?: string
  componentName?: string
  componentNames?: string[]
  typesFile?: string
}

/**
 * Recursively find all TypeScript files
 */
async function findTsFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      // Skip node_modules and dist
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      files.push(...(await findTsFiles(fullPath)))
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract icon names from file content
 */
function extractIconNames(content: string, componentNames: string[]): Set<string> {
  const iconNames = new Set<string>()
  let match: RegExpExecArray | null

  // Match: <Icon type="icon-name" or <Icon type={'icon-name'} for all component names
  for (const componentName of componentNames) {
    const typePattern = new RegExp(
      `<${componentName}\\s+[^>]*type=(?:["']([^"']+)["']|\\{['"]([^"']+)["']}})`,
      'g'
    )

    while ((match = typePattern.exec(content)) !== null) {
      const iconName = match[1] || match[2]
      if (iconName) {
        iconNames.add(iconName)
      }
    }
  }

  // Match: themed.xxxIcon ?? 'icon-name' (only if property ends with 'Icon')
  const themedPattern = /themed\.(\w*[Ii]con)\s*\?\?\s*["']([^"']+)["']/g
  while ((match = themedPattern.exec(content)) !== null) {
    if (match[2]) {
      iconNames.add(match[2])
    }
  }

  // Match: icon: 'icon-name' or iconType: 'icon-name' in object literals
  const iconPropPattern = /(?:icon|iconType):\s*["']([^"']+)["']/g
  while ((match = iconPropPattern.exec(content)) !== null) {
    if (match[1]) {
      iconNames.add(match[1])
    }
  }

  return iconNames
}

/**
 * Load available icon names from generated types file
 */
async function loadAvailableIcons(typesFile: string): Promise<Set<string> | null> {
  try {
    const content = await readFile(typesFile, 'utf-8')
    // Extract union type: export type IconType = 'icon1' | 'icon2' | ...
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
 * Main generator function
 */
async function generateIconLoaders(options: Options) {
  try {
    const cwd = process.cwd()
    const srcDir = resolve(cwd, options.source)
    const componentNames = options.componentNames || [options.componentName || 'Icon']

    console.log(`📁 Scanning directory: ${srcDir}`)
    console.log(`🔍 Looking for components: ${componentNames.join(', ')}`)

    // Load available icons if types file provided
    let availableIcons: Set<string> | null = null
    if (options.typesFile) {
      const typesPath = resolve(cwd, options.typesFile)
      availableIcons = await loadAvailableIcons(typesPath)
      if (availableIcons) {
        console.log(`✓ Loaded ${availableIcons.size} available icons from ${options.typesFile}`)
      } else {
        console.warn(`⚠️  Could not parse types file: ${options.typesFile}`)
      }
    }

    const files = await findTsFiles(srcDir)
    console.log(`📄 Found ${files.length} TypeScript files`)

    const allIconNames = new Set<string>()

    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      const icons = extractIconNames(content, componentNames)
      icons.forEach((icon) => allIconNames.add(icon))
    }

    let iconArray = Array.from(allIconNames).sort()

    // Validate against available icons if provided
    if (availableIcons) {
      const invalidIcons = iconArray.filter((icon) => !availableIcons.has(icon))
      if (invalidIcons.length > 0) {
        console.warn(`⚠️  Found ${invalidIcons.length} icons not in types file:`)
        console.warn(
          `   ${invalidIcons.slice(0, 5).join(', ')}${invalidIcons.length > 5 ? '...' : ''}`
        )
      }
      // Only generate loaders for valid icons
      iconArray = iconArray.filter((icon) => availableIcons.has(icon))
    }

    console.log(`✓ Found ${iconArray.length} unique icons`)

    if (iconArray.length > 0) {
      console.log(
        `  Icons: ${iconArray.slice(0, 10).join(', ')}${iconArray.length > 10 ? '...' : ''}`
      )
    }

    // Generate loader code
    const iconsPath = options.iconsPath || 'icons'
    const loaders = iconArray
      .map((icon) => `  '${icon}': () => import('${options.package}/${iconsPath}/${icon}.svg'),`)
      .join('\n')

    const output = `/**
 * Auto-generated icon loader registry
 * Package: ${options.package}
 * Icons found: ${iconArray.length}
 *
 * @generated by @number10/phaserjsx/generate-icon-loaders
 * @cspell: disable
 */

/**
 * Icon loaders - only icons used in the codebase are registered
 * Bundler will create separate chunks for each icon
 */
export const iconLoaders: Record<string, () => Promise<{ default: string }>> = {
${loaders || '  // No icons found'}
}
`

    const outputPath = resolve(cwd, options.output)
    await writeFile(outputPath, output, 'utf-8')

    console.log(`✓ Generated: ${outputPath}`)
    console.log(`✓ Registered ${iconArray.length} icon loaders`)
  } catch (error) {
    console.error('❌ Error generating icon loaders:', error)
    process.exit(1)
  }
}

// Parse CLI arguments
const { values } = parseArgs({
  options: {
    source: { type: 'string', short: 's' },
    output: { type: 'string', short: 'o' },
    package: { type: 'string', short: 'p' },
    iconsPath: { type: 'string', short: 'i' },
    componentName: { type: 'string', short: 'c' },
    componentNames: { type: 'string', multiple: true },
    typesFile: { type: 'string', short: 't' },
    help: { type: 'boolean', short: 'h' },
  },
})

if (values.help || !values.source || !values.output || !values.package) {
  console.log(`
Usage: generate-icon-loaders [options]

Options:
  -s, --source <path>         Source directory to scan (e.g., ./src)
  -o, --output <path>         Output file path (e.g., ./src/components/icon-loaders.generated.ts)
  -p, --package <name>        Icon package name (e.g., bootstrap-icons)
  -i, --iconsPath <path>      Relative path to icons in package (default: icons)
  -c, --componentName <name>  Icon component name to search for (default: Icon)
  --componentNames <names...> Multiple component names (e.g., Icon BootstrapIcon)
  -t, --typesFile <path>      Types file for validation (e.g., ./src/icon-types.generated.ts)
  -h, --help                  Show this help message

Examples:
  # Single component name
  generate-icon-loaders -s ./src -o ./src/icon-loaders.generated.ts -p bootstrap-icons

  # Multiple component names
  generate-icon-loaders -s ./src -o ./src/icon-loaders.generated.ts -p bootstrap-icons \\
    --componentNames Icon BootstrapIcon CustomIcon

  # With validation
  generate-icon-loaders -s ./src -o ./src/icon-loaders.generated.ts -p bootstrap-icons \\
    -t ./src/icon-types.generated.ts
`)
  process.exit(values.help ? 0 : 1)
}

// Run generator
const options: Options = {
  source: values.source as string,
  output: values.output as string,
  package: values.package as string,
}

if (values.iconsPath) {
  options.iconsPath = values.iconsPath
}

if (values.componentName) {
  options.componentName = values.componentName
}

if (values.componentNames && values.componentNames.length > 0) {
  options.componentNames = values.componentNames as string[]
}

if (values.typesFile) {
  options.typesFile = values.typesFile as string
}

generateIconLoaders(options)
