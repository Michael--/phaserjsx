/**
 * Vite type definitions for special imports
 */

/// <reference types="vite/client" />

/**
 * Allow importing SVG files as raw strings
 */
declare module '*.svg?raw' {
  const content: string
  export default content
}

/**
 * Allow importing SVG files (for use with Phaser)
 */
declare module '*.svg' {
  const content: string
  export default content
}
