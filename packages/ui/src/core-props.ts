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
 * Layout properties - basic sizing and spacing (minimal for now)
 */
export interface LayoutProps {
  width?: number
  height?: number
  margin?: EdgeInsets
  padding?: EdgeInsets
  /**
   * Layout direction for children
   * - 'column': Stack children vertically (default, like SwiftUI's VStack)
   * - 'row': Stack children horizontally (like SwiftUI's HStack)
   */
  direction?: 'row' | 'column'

  /**
   * Gap between children (uniform spacing)
   * Applied between each child along the main axis
   */
  gap?: number

  /**
   * Main axis alignment (along direction)
   * - 'start': Align children to start (top for column, left for row)
   * - 'center': Center children along main axis
   * - 'end': Align children to end (bottom for column, right for row)
   * - 'space-between': Distribute children evenly, first at start, last at end
   * - 'space-around': Distribute children evenly with space around each
   * - 'space-evenly': Distribute children with equal space between and around
   */
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'

  /**
   * Cross axis alignment (perpendicular to direction)
   * - 'start': Align to start (left for column, top for row)
   * - 'center': Center along cross axis
   * - 'end': Align to end (right for column, bottom for row)
   * - 'stretch': Stretch children to fill cross axis (requires fixed container size)
   */
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
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
