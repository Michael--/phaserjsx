/**
 * Core prop type definitions for shared component properties
 * These prop groups can be composed to build component-specific props
 */

// Import gesture types first so they can be used in GestureProps
import type { GestureEventData, TouchMoveState } from './gestures/gesture-types'

// Re-export for public API
export type { GestureEventData, TouchMoveState }

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

  /**
   * If true, object is rendered but excluded from layout calculations
   * Use for decorative elements, sprites, particles, or absolute-positioned objects
   * - true: Object is visual-only, doesn't affect parent/sibling layout
   * - false/undefined: Object participates in layout (default for UI elements)
   *
   * @example
   * // Decorative sprite that doesn't affect layout
   * <Sprite texture="particle" headless={true} />
   *
   * // Text that participates in layout
   * <Text text="Label" headless={false} />
   */
  headless?: boolean
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
 * Corner radius specification
 */
export interface CornerRadiusInsets {
  tl?: number
  tr?: number
  bl?: number
  br?: number
}

/**
 * Normalize edge insets - converts number to all-sides object
 * @param value - Number (all sides) or edge insets object
 * @returns Normalized EdgeInsets object
 */
export function normalizeEdgeInsets(value: number | EdgeInsets | undefined): EdgeInsets {
  if (value === undefined) {
    return {}
  }
  if (typeof value === 'number') {
    return { top: value, right: value, bottom: value, left: value }
  }
  return value
}

/**
 * Normalize corner radius - converts number to all-corners object
 * @param value - Number (all corners) or corner radius object
 * @returns Normalized CornerRadiusInsets object or number
 */
export function normalizeCornerRadius(
  value: number | CornerRadiusInsets | undefined
): number | CornerRadiusInsets {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'number') {
    return value
  }
  return value
}

/**
 * Layout properties - basic sizing and spacing (minimal for now)
 */
export interface LayoutProps {
  /**
   * Width of the container
   * - number: Fixed width in pixels (e.g., 200)
   * - string: Relative width (e.g., "50%", "100%")
   * - undefined: Auto - size to content
   *
   * @example
   * width={200}      // 200px fixed width
   * width="75%"      // 75% of parent width
   * width={undefined} // Auto-size to content
   */
  width?: number | string | undefined

  /**
   * Height of the container
   * - number: Fixed height in pixels (e.g., 100)
   * - string: Relative height (e.g., "50%", "100%")
   * - undefined: Auto - size to content
   *
   * @example
   * height={100}      // 100px fixed height
   * height="50%"      // 50% of parent height
   * height={undefined} // Auto-size to content
   */
  height?: number | string | undefined

  /**
   * * Margin outside the container
   * - number: Uniform margin on all sides
   * - EdgeInsets: Individual margin per side
   * - undefined: No margin
   */
  margin?: number | EdgeInsets | undefined

  /**
   * Padding inside the container
   * - number: Uniform padding on all sides
   * - EdgeInsets: Individual padding per side
   * - undefined: No padding
   */
  padding?: number | EdgeInsets | undefined

  /**
   * Layout direction for children
   * - 'column': Stack children vertically (default, like SwiftUI's VStack)
   * - 'row': Stack children horizontally (like SwiftUI's HStack)
   * - 'stack': Overlay children at the same position (like SwiftUI's ZStack)
   */
  direction?: 'row' | 'column' | 'stack'

  /**
   * Gap between children (uniform spacing)
   * Applied between each child along the main axis
   */
  gap?: number | undefined

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

  /**
   * Flex grow factor - how much of the remaining space this element should take
   * Similar to CSS flexbox flex-grow
   * - 0: Don't grow, use explicit width/height
   * - 1: Take equal share of remaining space
   * - 2+: Take proportionally more space
   *
   * @example
   * // Sidebar fixed, main content fills rest
   * <View direction="row">
   *   <View width={200}>Sidebar</View>
   *   <View flex={1}>Main</View>
   * </View>
   *
   * // Two columns, second twice as wide
   * <View direction="row">
   *   <View flex={1}>Col 1</View>
   *   <View flex={2}>Col 2</View>
   * </View>
   */
  flex?: number

  /**
   * Controls how content that overflows the container bounds is displayed
   * - 'visible': Content can overflow container bounds (default)
   * - 'hidden': Content is clipped to container bounds using Phaser mask
   *
   * @example
   * <View width={100} height={50} overflow="hidden">
   *   <Text text="This long text will be clipped" />
   * </View>
   */
  overflow?: 'visible' | 'hidden'
}

/**
 * Background styling properties
 */
export interface BackgroundProps {
  backgroundColor?: number | undefined
  backgroundAlpha?: number | undefined
  cornerRadius?: number | CornerRadiusInsets
  borderWidth?: number
  borderColor?: number | undefined
  borderAlpha?: number
}

/**
 * Text-specific styling properties
 */
export interface TextSpecificProps {
  text: string
  fontStyle?: string
  align?: 'left' | 'center' | 'right'
  maxWidth?: number
}

/**
 * High-level gesture props - unified touch and mouse interaction
 * These provide cross-platform gesture detection with transparent mouse/touch support
 */
export interface GestureProps {
  /**
   * Enable gesture system for this container
   * Must be true to receive any gesture events
   * Default: false (no overhead for non-interactive containers)
   */
  enableGestures?: boolean

  /**
   * Called on pointer down + up on the same target (click/tap)
   * Works for both mouse click and touch tap
   * Only fires if touch duration is within maxTouchDuration
   */
  onTouch?: (data: GestureEventData) => void

  /**
   * Called during pointer movement - continues even when outside bounds
   * Provides dx/dy deltas for tracking drag operations
   * Includes isInside flag and state ('start' | 'move' | 'end')
   * Requires enableGestures: true
   */
  onTouchMove?: (data: GestureEventData) => void

  /**
   * Called when double tap/click is detected within configured delay
   * Optional - only enable if needed to reduce overhead
   */
  onDoubleTap?: (data: GestureEventData) => void

  /**
   * Called when pointer is held down for configured duration
   * Optional - only enable if needed to reduce overhead
   */
  onLongPress?: (data: GestureEventData) => void

  /**
   * Duration in ms to trigger long press
   * Default: 500ms
   */
  longPressDuration?: number

  /**
   * Max time in ms between taps for double tap detection
   * Default: 300ms
   */
  doubleTapDelay?: number

  /**
   * Max time in ms for a valid touch/click (prevents delayed touch after long hold)
   * Default: 500ms
   */
  maxTouchDuration?: number
}
