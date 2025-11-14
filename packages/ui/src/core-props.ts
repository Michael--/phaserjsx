/**
 * Core prop type definitions for shared component properties
 * These prop groups can be composed to build component-specific props
 */

/**
 * Transform properties - position, rotation, scale, depth, visibility
 */
export interface TransformProps {
  x?: number
  y?: number
  rotation?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  alpha?: number
  depth?: number
  visible?: boolean
}

/**
 * Edge insets for margins and padding
 */
export interface EdgeInsets {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

/**
 * Main axis alignment options for flex-like layouts
 */
export type MainAxisAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around'

/**
 * Cross axis alignment options for flex-like layouts
 */
export type CrossAxisAlign = 'start' | 'center' | 'end' | 'stretch'

/**
 * Layout properties - margins, padding, alignment, sizing
 */
export interface LayoutProps {
  margin?: EdgeInsets
  padding?: EdgeInsets
  alignMain?: MainAxisAlign
  alignCross?: CrossAxisAlign
  width?: number
  height?: number
}

/**
 * Background styling properties
 */
export interface BackgroundProps {
  backgroundColor?: number
  backgroundAlpha?: number
  cornerRadius?: number
}

/**
 * Text-specific styling properties
 */
export interface TextSpecificProps {
  text: string
  color?: string | number
  fontSize?: number
  fontFamily?: string
  fontStyle?: string
  align?: 'left' | 'center' | 'right'
  maxWidth?: number
}

/**
 * Interaction props for pointer events
 */
export interface InteractionProps {
  onPointerDown?: (pointer: Phaser.Input.Pointer) => void
  onPointerUp?: (pointer: Phaser.Input.Pointer) => void
  onPointerOver?: (pointer: Phaser.Input.Pointer) => void
  onPointerOut?: (pointer: Phaser.Input.Pointer) => void
}
