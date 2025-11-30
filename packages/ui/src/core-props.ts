/**
 * Core prop type definitions for shared component properties
 * These prop groups can be composed to build component-specific props
 */

// Import gesture types first so they can be used in GestureProps
import type {
  FocusEventData,
  GestureEventData,
  InputEventData,
  KeyboardEventData,
  TouchMoveState,
} from './gestures/gesture-types'

// Re-export for public API
export type { FocusEventData, GestureEventData, InputEventData, KeyboardEventData, TouchMoveState }

/**
 * Valid CSS-like size values with type safety
 * - Fixed pixels: number or "20px"
 * - Percentage: "50%", "100%"
 * - Viewport units: "100vw", "50vh"
 * - Keywords: "auto", "fill"
 * - Calc expressions: "calc(100% - 20px)"
 */
export type SizeValue =
  | number
  | 'auto'
  | 'fill'
  | `${number}%`
  | `${number}px`
  | `${number}vw`
  | `${number}vh`
  | `calc(${string})`

/**
 * Flex basis size values (subset of SizeValue, no "fill" keyword)
 * - Fixed pixels: number or "20px"
 * - Percentage: "50%", "100%"
 * - Viewport units: "100vw", "50vh"
 * - Keyword: "auto"
 * - Calc expressions: "calc(50% + 10px)"
 */
export type FlexBasisValue =
  | number
  | 'auto'
  | `${number}%`
  | `${number}px`
  | `${number}vw`
  | `${number}vh`
  | `calc(${string})`

/**
 * Transform properties - geometric transformations (position, rotation, scale)
 */
export interface TransformProps {
  x?: number
  y?: number
  rotation?: number
  scale?: number
  scaleX?: number
  scaleY?: number
}

/**
 * Phaser GameObject display properties - rendering and display list API
 */
export interface PhaserProps {
  /**
   * Alpha transparency of the game object
   * - 0: Fully transparent
   * - 1: Fully opaque
   */
  alpha?: number

  /**
   * Depth (Z-index) of the game object in the display list
   * Higher values are rendered on top of lower values
   * Allows manual control over rendering order independent of child array order
   *
   * @example
   * // Layer system in stack layout
   * <View direction="stack">
   *   <View depth={1}>Background</View>
   *   <View depth={2}>Content</View>
   *   <View depth={3}>Overlay</View>
   * </View>
   */
  depth?: number

  /**
   * Visibility of the game object
   * - true: Object is rendered (default)
   * - false: Object is hidden but still exists in scene
   */
  visible?: boolean

  /**
   * Callback invoked when GameObject is created and fully initialized
   * Useful for accessing GameObject properties (dimensions, bounds, etc.)
   * without needing useRef
   *
   * @param node - The created Phaser GameObject
   *
   * @example
   * // Display image dimensions
   * <Image
   *   texture="icon"
   *   onReady={(img) => console.log(`${img.width}x${img.height}`)}
   * />
   *
   * // Access View bounds
   * <View
   *   width={200}
   *   height={100}
   *   onReady={(view) => console.log(view.getBounds())}
   * />
   */
  onReady?: (node: Phaser.GameObjects.GameObject) => void
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
 * Gap insets for horizontal and vertical gaps
 */
export interface GapInsets {
  horizontal?: number
  vertical?: number
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
 * Normalize gap values - converts number to GapInsets object
 * @param value - Number (uniform gap) or gap insets object
 * @returns Normalized GapInsets object with horizontal and vertical values
 */
export function normalizeGap(value: number | GapInsets | undefined): {
  horizontal: number
  vertical: number
} {
  if (value === undefined) {
    return { horizontal: 0, vertical: 0 }
  }
  if (typeof value === 'number') {
    return { horizontal: value, vertical: value }
  }
  return {
    horizontal: value.horizontal ?? 0,
    vertical: value.vertical ?? 0,
  }
}

/**
 * Layout properties - sizing, spacing, and layout participation
 */
export interface LayoutProps {
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

  /**
   * Width of the container
   * - number: Fixed width in pixels (e.g., 200)
   * - Percentage: "50%", "100%"
   * - Viewport: "100vw"
   * - Keywords: "auto", "fill"
   * - Calc: "calc(100% - 20px)"
   * - undefined: Auto - size to content
   *
   * @example
   * width={200}           // 200px fixed width
   * width="75%"           // 75% of parent width
   * width="100vw"         // 100% of viewport width
   * width="fill"          // Fill available space
   * width="calc(50% + 10px)" // Calculated width
   * width={undefined}     // Auto-size to content
   */
  width?: SizeValue | undefined

  /**
   * Height of the container
   * - number: Fixed height in pixels (e.g., 100)
   * - Percentage: "50%", "100%"
   * - Viewport: "100vh"
   * - Keywords: "auto", "fill"
   * - Calc: "calc(100vh - 50px)"
   * - undefined: Auto - size to content
   *
   * @example
   * height={100}          // 100px fixed height
   * height="50%"          // 50% of parent height
   * height="100vh"        // 100% of viewport height
   * height="fill"         // Fill available space
   * height="calc(100% - 20px)" // Calculated height
   * height={undefined}    // Auto-size to content
   */
  height?: SizeValue | undefined

  /**
   * Minimum width constraint
   * Prevents element from shrinking below this size
   * Works with flex, percentages, and auto sizing
   * Supports all SizeValue formats (pixels, percentage, viewport units, calc)
   *
   * @example
   * // Fixed minimum
   * <View flex={1} minWidth={200}>Sidebar</View>
   *
   * // Percentage of parent
   * <View width="100%" minWidth="20%" maxWidth="80%">Flexible</View>
   *
   * // Viewport-based
   * <View flex={1} minWidth="200px">Responsive sidebar</View>
   *
   * // Calc expression
   * <View width="100%" minWidth="calc(50% - 20px)">Dynamic</View>
   */
  minWidth?: SizeValue | undefined

  /**
   * Minimum height constraint
   * Prevents element from shrinking below this size
   * Works with flex, percentages, and auto sizing
   * Supports all SizeValue formats (pixels, percentage, viewport units, calc)
   *
   * @example
   * // Fixed minimum
   * <View height="auto" minHeight={100}>
   *   <Text text={dynamicContent} />
   * </View>
   *
   * // Percentage of parent
   * <View height="100%" minHeight="30%">Flexible height</View>
   *
   * // Viewport-based
   * <View flex={1} minHeight="50vh">Half viewport min</View>
   */
  minHeight?: SizeValue | undefined

  /**
   * Maximum width constraint
   * Prevents element from growing beyond this size
   * Works with flex, percentages, and auto sizing
   * Supports all SizeValue formats (pixels, percentage, viewport units, calc)
   *
   * @example
   * // Fixed maximum
   * <View flex={1} maxWidth={800}>
   *   <Text text="Long content..." />
   * </View>
   *
   * // Percentage of parent
   * <View width="100%" maxWidth="80%">Responsive</View>
   *
   * // Viewport-based
   * <View flex={1} maxWidth="90vw">Full width modal</View>
   */
  maxWidth?: SizeValue | undefined

  /**
   * Maximum height constraint
   * Prevents element from growing beyond this size
   * Works with flex, percentages, and auto sizing
   * Supports all SizeValue formats (pixels, percentage, viewport units, calc)
   *
   * @example
   * // Fixed maximum
   * <Image texture="photo" width="100%" maxHeight={400} />
   *
   * // Percentage of parent
   * <View height="100%" maxHeight="80%">Constrained</View>
   *
   * // Viewport-based
   * <View flex={1} maxHeight="80vh">Scrollable content</View>
   */
  maxHeight?: SizeValue | undefined

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
   * Gap between children
   * - number: Uniform gap between all children
   * - GapInsets: Separate horizontal and vertical gaps
   * Applied between each child along the main axis (or both axes for GapInsets)
   */
  gap?: number | GapInsets | undefined

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
   * Flex shrink factor - how much this element should shrink when space is limited
   * Similar to CSS flexbox flex-shrink
   * - 0: Don't shrink, maintain size even if container overflows
   * - 1: Shrink proportionally with other flex items (default)
   * - 2+: Shrink more than other items proportionally
   *
   * @example
   * // Text that can shrink, icon that stays fixed
   * <View direction="row" width={150}>
   *   <View width={50} flexShrink={0}>Icon</View>
   *   <View flex={1} flexShrink={1}>Long Text...</View>
   * </View>
   *
   * // Two items, second shrinks twice as fast
   * <View direction="row" width={100}>
   *   <View width={80} flexShrink={1}>Item 1</View>
   *   <View width={80} flexShrink={2}>Item 2</View>
   * </View>
   */
  flexShrink?: number

  /**
   * Flex basis - initial size before flex distribution
   * Similar to CSS flexbox flex-basis
   * - number: Fixed initial size in pixels
   * - Percentage: "50%", "100%"
   * - Viewport: "100vw", "50vh"
   * - Keyword: "auto"
   * - Calc: "calc(50% + 10px)"
   * - undefined: Use width/height as basis
   *
   * Defines the starting size before flexGrow/flexShrink is applied
   * Overrides width/height when flex is used
   *
   * @example
   * // Item starts at 200px, then grows with flex
   * <View flex={1} flexBasis={200}>Content</View>
   *
   * // Item starts at 50% of parent, then shrinks if needed
   * <View flexBasis="50%" flexShrink={1}>Content</View>
   *
   * // Auto basis - uses content size
   * <View flex={1} flexBasis="auto">Content</View>
   *
   * // Calc basis
   * <View flex={1} flexBasis="calc(100% / 3)">Content</View>
   */
  flexBasis?: FlexBasisValue | undefined

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

  /**
   * Controls wrapping behavior for flex layouts
   * - 'nowrap': All items in single line (default, current behavior)
   * - 'wrap': Items wrap to new line/column when space exhausted
   * - 'wrap-reverse': Items wrap in reverse order
   *
   * Only applies to 'row' and 'column' directions, ignored for 'stack'
   * When wrapping, flex distribution is calculated per line
   *
   * @example
   * // Auto-wrap grid with 100px items
   * <View direction="row" flexWrap="wrap" gap={10} width={400}>
   *   {items.map(item => <Card width={100} />)}
   * </View>
   *
   * // Responsive card grid
   * <View direction="row" flexWrap="wrap" gap={15}>
   *   {cards.map(card => <View minWidth={180} flex={1}>{card}</View>)}
   * </View>
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'

  /**
   * Alignment of wrapped lines in multi-line flex container
   * Only applies when flexWrap !== 'nowrap' and there are multiple lines
   * Controls distribution of lines along cross axis (perpendicular to direction)
   *
   * - 'start': Pack lines to start (top for row, left for column)
   * - 'center': Center lines in container
   * - 'end': Pack lines to end (bottom for row, right for column)
   * - 'space-between': First line at start, last at end, equal space between
   * - 'space-around': Equal space around each line
   * - 'stretch': Lines stretch to fill cross axis (default)
   *
   * Difference from alignItems:
   * - alignItems: Aligns items within each line
   * - alignContent: Aligns the lines themselves within container
   *
   * @example
   * ```tsx
   * // Grid with lines distributed vertically
   * <View
   *   direction="row"
   *   flexWrap="wrap"
   *   alignContent="space-between"
   *   height={400}
   * >
   *   {items}
   * </View>
   * ```
   */
  alignContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'stretch'
}

/**
 * Background styling properties
 */
export interface BackgroundProps {
  backgroundColor?: number | undefined
  backgroundAlpha?: number | undefined
  cornerRadius?: number | CornerRadiusInsets | undefined
  borderWidth?: number | undefined
  borderColor?: number | undefined
  borderAlpha?: number
}

/**
 * Text-specific styling properties
 */
export interface TextSpecificProps {
  text: string | undefined
  fontStyle?: string
  align?: 'left' | 'center' | 'right'
  /**
   * Maximum width for text wrapping
   * Supports all SizeValue formats (pixels, percentage, viewport units, calc)
   */
  maxWidth?: SizeValue
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
   * Called when pointer up occurs outside the container
   * Useful for click-outside detection (dropdowns, modals, tooltips)
   * Only fires if touch duration is within maxTouchDuration
   * Requires enableGestures: true
   */
  onTouchOutside?: (data: GestureEventData) => void

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

  /**
   * Called when a key is pressed down
   * Requires enableGestures: true
   */
  onKeyDown?: (data: KeyboardEventData) => void

  /**
   * Called when a key is released
   * Requires enableGestures: true
   */
  onKeyUp?: (data: KeyboardEventData) => void

  /**
   * Called when input value changes
   * Requires enableGestures: true
   */
  onInput?: (data: InputEventData) => void

  /**
   * Called when element receives focus
   * Requires enableGestures: true
   */
  onFocus?: (data: FocusEventData) => void

  /**
   * Called when element loses focus
   * Requires enableGestures: true
   */
  onBlur?: (data: FocusEventData) => void
}
