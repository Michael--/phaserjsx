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
  borderColor?: number
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
 * Interaction props for pointer events
 */
export interface InteractionProps {
  onPointerDown?: (pointer: Phaser.Input.Pointer) => void
  onPointerUp?: (pointer: Phaser.Input.Pointer) => void
  onPointerOver?: (pointer: Phaser.Input.Pointer) => void
  onPointerOut?: (pointer: Phaser.Input.Pointer) => void
  onPointerMove?: (pointer: Phaser.Input.Pointer) => void
  onPointerUpOutside?: (pointer: Phaser.Input.Pointer) => void
}
