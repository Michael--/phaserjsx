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
export * from './memo'
export * from './theme'
export * from './types'
export * from './vdom'

// Export core prop utilities
export {
  normalizeCornerRadius,
  normalizeEdgeInsets,
  type CornerRadiusInsets,
  type EdgeInsets,
} from './core-props'

// Export gesture types explicitly for better IDE support
export type { GestureEventData, GestureProps, TouchMoveState } from './core-props'

// Explicit export for convenience functions
export { mountJSX as mountComponent } from './vdom'

// Re-export component creators/patchers for advanced usage
export * from './components'

// Animation utilities for spring-based transitions
export * from './animation'

// Color system utilities and presets
export * from './colors'

// Design token system - semantic tokens for colors, text styles, spacing, etc.
export * from './design-tokens'

// Viewport context - provides screen dimensions for vw/vh units
export { viewportRegistry, type ViewportSize } from './viewport-context'

/**
 * Consumers can import JSX runtime from here:
 *   import { jsx, jsxs, Fragment } from "@phaserjsx/ui/jsx-runtime";
 */
export { Fragment, jsx, jsxs } from './jsx-runtime'

// Development configuration and debugging utilities
export { DebugLogger, DevConfig, DevPresets } from './dev-config'
