import { defineIconConfig } from '@number10/phaserjsx/scripts/icon-generator-config'

/**
 * Icon generator configuration for test-ui
 * Replaces long CLI arguments with a clean config file
 */
export default defineIconConfig({
  // Icon sources - multiple sources are supported!
  source: [
    {
      package: 'bootstrap-icons',
      iconsPath: 'icons',
      label: 'Bootstrap Icons',
    },
    {
      directory: './src/custom-icons',
      label: 'Custom Icons',
    },
  ],

  // Type generation - creates TypeScript union type
  types: {
    enabled: true,
    scanIconDirectory: 'start',
    output: './src/components/icon-types.generated.ts',
    typeName: 'IconType',
  },

  // Loader generation - creates dynamic imports for used icons
  loaders: {
    enabled: true,
    generateLoaders: 'watch',
    output: './src/components/icon-loaders.generated.ts',
    scanDir: './src',
    componentNames: ['Icon', 'BootstrapIcon'],
    validate: true, // Warn about icons not in types file
  },

  // Custom patterns for detecting icon usage in theme objects and other contexts
  // Extends built-in patterns: <Icon type="..." />, themed.xxxIcon ?? '...', icon: '...'
  // See ICON_CUSTOM_PATTERNS.md for documentation
  customPatterns: [
    {
      name: 'Theme icon properties (bodyIcon, checkedIcon, etc.)',
      pattern: String.raw`(\w*[Ii]con):\s*['"]([^'"]+)['"]`,
      captureGroup: 2,
    },
  ],

  // Exclude patterns when scanning for icon usage
  exclude: ['node_modules', 'dist', '.git'],
})
