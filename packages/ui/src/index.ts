/**
 * PhaserJSX UI Library
 * Provides JSX + hooks + VDOM for Phaser 3 game development
 */
import { registerBuiltins } from './components'
import './jsx-types' // Import JSX type declarations

// Register built-in components (View, Text) on module load
registerBuiltins()

export * from './core-types'
export * from './hooks'
export * from './host'
export * from './types'
export * from './vdom'

// Explicit export for convenience functions
export { mountJSX as mountComponent } from './vdom'

// Re-export component creators/patchers for advanced usage
export * from './components'

/**
 * Consumers can import JSX runtime from here:
 *   import { jsx, jsxs, Fragment } from "@phaserjsx/ui/jsx-runtime";
 */
export { Fragment, jsx, jsxs } from './jsx-runtime'

// Development configuration and debugging utilities
export { DebugLogger, DevConfig, DevPresets } from './dev-config'
