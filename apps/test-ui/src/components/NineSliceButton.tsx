/**
 * NineSliceButton - Convenience component for creating buttons with NineSlice backgrounds
 *
 * This component simplifies the creation of scalable buttons by automatically handling
 * the stack layout pattern and inner content positioning.
 */
import type { ChildrenType, ViewProps } from '@phaserjsx/ui'
import { NineSlice, View } from '@phaserjsx/ui'

/**
 * Props for NineSliceButton component
 *
 * @remarks
 * This component creates a button with a NineSlice background and a content area.
 * The content area is automatically sized to exclude the slice borders.
 *
 * **IMPORTANT - Atlas/Texture Configuration:**
 *
 * The slice dimensions (leftWidth, rightWidth, topHeight, bottomHeight) must match
 * the actual design of your texture asset in the texture atlas. These values define
 * which parts of the source image are the "corners" and "edges" vs the "center".
 *
 * **Things to consider:**
 * - Inspect your texture atlas to determine the correct slice values
 * - The slice values are in pixels of the SOURCE texture, not the scaled button
 * - Sum of leftWidth + rightWidth should be less than the source texture width
 * - Sum of topHeight + bottomHeight should be less than the source texture height
 * - Width and height props define the FINAL size of the button after scaling
 * - The center area will stretch, but corners and edges maintain their size
 *
 * @example
 * ```tsx
 * // For a button texture that is 64x32 in the atlas with 8px corners:
 * <NineSliceButton
 *   texture="ui"
 *   frame="button-green"
 *   width={200}          // Final button width
 *   height={80}          // Final button height
 *   leftWidth={8}        // Left edge is 8px in source texture
 *   rightWidth={8}       // Right edge is 8px in source texture
 *   topHeight={8}        // Top edge is 8px in source texture
 *   bottomHeight={8}     // Bottom edge is 8px in source texture
 *   onClick={() => console.log('clicked')}
 * >
 *   <Text text="Click Me" />
 * </NineSliceButton>
 * ```
 *
 * @example
 * ```tsx
 * // Horizontal-only (3-slice) button - omit topHeight/bottomHeight:
 * <NineSliceButton
 *   texture="ui"
 *   frame="progress-bar"
 *   width={300}
 *   height={40}
 *   leftWidth={10}
 *   rightWidth={10}
 * >
 *   <Text text="Progress: 75%" />
 * </NineSliceButton>
 * ```
 */
export interface NineSliceButtonProps {
  /**
   * Texture key from the loaded texture atlas
   * Must be loaded before use (e.g., in a preload scene)
   */
  texture: string

  /**
   * Frame name or index within the texture atlas
   * Optional if the texture is not an atlas
   */
  frame?: string | number

  /**
   * Final width of the button in pixels
   */
  width: number

  /**
   * Final height of the button in pixels
   */
  height: number

  /**
   * Width of the left slice in pixels of the SOURCE texture
   * This defines the non-stretching left border/corner area
   */
  leftWidth: number

  /**
   * Width of the right slice in pixels of the SOURCE texture
   * This defines the non-stretching right border/corner area
   */
  rightWidth: number

  /**
   * Height of the top slice in pixels of the SOURCE texture
   * This defines the non-stretching top border/corner area
   * Optional - omit for 3-slice (horizontal only) mode
   */
  topHeight?: number

  /**
   * Height of the bottom slice in pixels of the SOURCE texture
   * This defines the non-stretching bottom border/corner area
   * Optional - omit for 3-slice (horizontal only) mode
   */
  bottomHeight?: number

  /**
   * Click handler for button interaction
   */
  onClick?: () => void

  /**
   * Children to render in the content area (inside the slices)
   * Automatically positioned within the inner bounds
   */
  children?: ChildrenType

  /**
   * Optional depth for rendering order
   */
  depth?: number

  /**
   * Optional alpha/transparency (0-1)
   */
  alpha?: number

  /**
   * Optional visibility toggle
   */
  visible?: boolean

  /**
   * Optional scale transformation
   */
  scale?: number

  /**
   * Optional X-axis scale
   */
  scaleX?: number

  /**
   * Optional Y-axis scale
   */
  scaleY?: number

  /**
   * Optional rotation in radians
   */
  rotation?: number

  /**
   * Alignment of children within the content area (horizontal)
   */
  alignItems?: ViewProps['alignItems']

  /**
   * Alignment of children within the content area (vertical)
   */
  justifyContent?: ViewProps['justifyContent']

  /**
   * Optional border for debugging content area
   */
  borderWidth?: number

  /**
   * Optional border color for debugging content area
   */
  borderColor?: number

  /**
   * Optional gap between children in the content area
   */
  gap?: number

  /**
   * Optional padding inside the content area
   */
  padding?: ViewProps['padding']

  /**
   * Layout direction for children within the content area
   */
  direction?: ViewProps['direction']
}

/**
 * NineSliceButton component - creates a scalable button with NineSlice background
 *
 * This is a convenience wrapper around NineSlice + View that handles:
 * - Stack layout for background and content
 * - Automatic inner content area calculation
 * - Click interaction handling
 * - Proper content alignment
 *
 * @param props - NineSliceButton properties
 * @returns JSX element representing a button with NineSlice background
 *
 * @example
 * ```tsx
 * <NineSliceButton
 *   texture="ui"
 *   frame="button-blue"
 *   width={250}
 *   height={100}
 *   leftWidth={20}
 *   rightWidth={20}
 *   topHeight={15}
 *   bottomHeight={15}
 *   onClick={() => console.log('Button clicked!')}
 *   alignItems="center"
 *   justifyContent="center"
 * >
 *   <Text text="Click Me!" style={{ fontSize: 24 }} />
 * </NineSliceButton>
 * ```
 */

export function NineSliceButton(props: NineSliceButtonProps) {
  const innerWidth = props.width - props.leftWidth - props.rightWidth
  const innerHeight = props.height - (props.topHeight ?? 0) - (props.bottomHeight ?? 0)

  return (
    <View
      direction="stack"
      backgroundAlpha={0.0}
      width={props.width}
      height={props.height}
      {...(props.onClick !== undefined && { onPointerDown: props.onClick })}
      {...(props.depth !== undefined && { depth: props.depth })}
      {...(props.alpha !== undefined && { alpha: props.alpha })}
      {...(props.visible !== undefined && { visible: props.visible })}
      {...(props.scale !== undefined && { scale: props.scale })}
      {...(props.scaleX !== undefined && { scaleX: props.scaleX })}
      {...(props.scaleY !== undefined && { scaleY: props.scaleY })}
      {...(props.rotation !== undefined && { rotation: props.rotation })}
    >
      <NineSlice
        texture={props.texture}
        {...(props.frame !== undefined && { frame: props.frame })}
        width="100%"
        height="100%"
        leftWidth={props.leftWidth}
        rightWidth={props.rightWidth}
        {...(props.topHeight !== undefined && { topHeight: props.topHeight })}
        {...(props.bottomHeight !== undefined && { bottomHeight: props.bottomHeight })}
      />
      <View
        backgroundAlpha={0.0}
        direction={props.direction ?? 'column'}
        x={props.leftWidth}
        y={props.topHeight ?? 0}
        width={innerWidth}
        height={innerHeight}
        alignItems={props.alignItems ?? 'center'}
        justifyContent={props.justifyContent ?? 'center'}
        {...(props.gap !== undefined && { gap: props.gap })}
        {...(props.padding !== undefined && { padding: props.padding })}
        {...(props.borderWidth !== undefined && { borderWidth: props.borderWidth })}
        {...(props.borderColor !== undefined && { borderColor: props.borderColor })}
      >
        {props.children}
      </View>
    </View>
  )
}
