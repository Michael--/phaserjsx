/**
 * Configuration schema for icon generators
 * This file defines the TypeScript types for icon-generator.config.ts
 */

/**
 * Source configuration - where to find icons
 */
export interface IconSource {
  /** Icon package name from node_modules (e.g., 'bootstrap-icons') */
  package?: string
  /** Local directory with SVG files (alternative to package) */
  directory?: string
  /** Relative path to icons within package (default: 'icons') */
  iconsPath?: string
  /** Optional label for this source (used in logs for multi-source) */
  label?: string
}

/**
 * Type generation configuration
 */
export interface TypesConfig {
  /** Enable types generation */
  enabled: boolean
  /** Output file path for generated types */
  output: string
  /** TypeScript type name (default: 'IconType') */
  typeName?: string
  /**
   * When to scan icon directories (Vite plugin only)
   * - 'never': Never scan (types must be generated manually)
   * - 'start': Scan once at startup
   * - 'watch': Scan at startup and on SVG file changes (default)
   */
  scanIconDirectory?: 'never' | 'start' | 'watch'
}

/**
 * Loader generation configuration
 */
export interface LoadersConfig {
  /** Enable loaders generation */
  enabled: boolean
  /** Output file path for generated loaders */
  output: string
  /** Source directory to scan for icon usage */
  scanDir: string
  /** Component names to search for (e.g., ['Icon', 'BootstrapIcon']) */
  componentNames?: string[]
  /** Validate against types file (enables warnings for invalid icons) */
  validate?: boolean
  /**
   * When to generate loaders (Vite plugin only)
   * - 'start': Generate once at startup
   * - 'watch': Generate at startup and on code file changes (default)
   */
  generateLoaders?: 'start' | 'watch'
}

/**
 * Custom pattern for detecting icon usage
 */
export interface CustomPattern {
  /** Pattern name/description */
  name: string
  /** Regex pattern as string (will be compiled with 'g' flag) */
  pattern: string
  /** Capture group index for icon name (1-based) */
  captureGroup: number
}

/**
 * Main configuration for icon generator
 */
export interface IconGeneratorConfig {
  /** Icon source configuration - single source or array of sources */
  source: IconSource | IconSource[]

  /** Type generation configuration */
  types?: TypesConfig

  /** Loader generation configuration */
  loaders?: LoadersConfig

  /** Custom patterns for detecting icon usage in loaders */
  customPatterns?: CustomPattern[]

  /** Exclude patterns (glob) when scanning for icons */
  exclude?: string[]
}

/**
 * Helper function to define config with type safety
 */
export function defineIconConfig(config: IconGeneratorConfig): IconGeneratorConfig {
  return config
}
