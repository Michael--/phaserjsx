import { defineIconConfig } from '@phaserjsx/ui/scripts/icon-generator-config'

/**
 * Icon generator configuration for docs-site
 * Generates type-safe icon types and dynamic loaders for Bootstrap Icons
 */
export default defineIconConfig({
  // Icon source: Bootstrap Icons package
  source: [
    {
      package: 'bootstrap-icons',
      iconsPath: 'icons',
      label: 'Bootstrap Icons',
    },
  ],

  // Type generation: Creates TypeScript union type with all available icons
  types: {
    enabled: true,
    scanIconDirectory: 'start', // Generate once at dev server start
    output: './src/components/Icon/icon-types.generated.ts',
    typeName: 'IconType',
  },

  // Loader generation: Creates dynamic imports for actually used icons
  loaders: {
    enabled: true,
    generateLoaders: 'watch', // Regenerate when code changes
    output: './src/components/Icon/icon-loaders.generated.ts',
    scanDir: './src',
    componentNames: ['Icon'], // Component name to scan for
    validate: true, // Warn about icons not in types file
  },

  // Custom patterns for detecting icon usage in theme objects
  customPatterns: [
    {
      name: 'Theme icon properties',
      pattern: String.raw`(\w*[Ii]con):\s*['"]([^'"]+)['"]`,
      captureGroup: 2,
    },
  ],

  // Exclude patterns when scanning for icon usage
  exclude: ['node_modules', 'dist', '.git', 'build'],
})
