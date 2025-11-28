import { defineIconConfig } from '@phaserjsx/ui/scripts/icon-generator-config'

/**
 * Icon generator configuration for test-ui
 * Replaces long CLI arguments with a clean config file
 */
export default defineIconConfig({
  // Icon source - where to find the icons
  source: {
    package: 'bootstrap-icons',
    iconsPath: 'icons',
  },

  // Type generation - creates TypeScript union type
  types: {
    enabled: true,
    output: './src/components/icon-types.generated.ts',
    typeName: 'IconType',
  },

  // Loader generation - creates dynamic imports for used icons
  loaders: {
    enabled: true,
    output: './src/components/icon-loaders.generated.ts',
    scanDir: './src',
    componentNames: ['Icon', 'BootstrapIcon'],
    validate: true, // Warn about icons not in types file
  },

  // Exclude patterns when scanning for icon usage
  exclude: ['node_modules', 'dist', '.git'],
})
