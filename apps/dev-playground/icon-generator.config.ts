import { defineIconConfig } from '@number10/phaserjsx/scripts/icon-generator-config'

/**
 * Icon generator configuration for dev-playground
 * Generates type-safe icon types and dynamic loaders for Lucide Icons
 */
export default defineIconConfig({
  // Icon source: Lucide Static package
  source: [
    {
      package: 'lucide-static',
      iconsPath: 'icons',
      label: 'Lucide Icons',
    },
  ],

  // Type generation: Creates TypeScript union type with all available icons
  types: {
    enabled: true,
    scanIconDirectory: 'start', // Generate once at dev server start
    output: './src/components/icon-types.generated.ts',
    typeName: 'IconType',
  },

  // Loader generation: Creates dynamic imports for actually used icons
  loaders: {
    enabled: true,
    generateLoaders: 'watch', // Regenerate when code changes
    output: './src/components/icon-loaders.generated.ts',
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
