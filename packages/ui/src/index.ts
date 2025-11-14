/**
 * PhaserJSX UI Library
 * Provides JSX + hooks + VDOM for Phaser 3 game development
 */
import { registerBuiltins } from './components'

// Register built-in components (View, Text) on module load
registerBuiltins()

export * from './core-types'
export * from './hooks'
export * from './host'
export * from './types'
export * from './vdom'
export * from './widgets'

/**
 * Consumers can import JSX runtime from here:
 *   import { jsx, jsxs, Fragment } from "@phaserjsx/ui/jsx-runtime";
 */
export { Fragment, jsx, jsxs } from './jsx-runtime'
