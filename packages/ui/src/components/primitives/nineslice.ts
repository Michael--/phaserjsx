/**
 * NineSlice component - Phaser NineSlice GameObject for scalable UI panels
 * Status: IMPLEMENTED ✅
 *
 * Design Overview:
 * ================
 *
 * 1. Component Role: SCALABLE UI PANELS
 *    Purpose: Create resizable UI elements that preserve border/corner integrity
 *    Phaser Type: Phaser.GameObjects.NineSlice (9-slice scaling)
 *    Use Cases:
 *    - Buttons with fixed corner radius
 *    - Dialog boxes with preserved borders
 *    - Progress bars with capped ends
 *    - Panels that scale without distorting decorative edges
 *
 * 2. Nine-Slice Scaling Concept:
 *    Texture divided into 9 regions:
 *      ┌─────┬─────────┬─────┐
 *      │ TL  │   Top   │ TR  │  (corners + edges)
 *      ├─────┼─────────┼─────┤
 *      │Left │ Center  │Right│  (center scales, edges stretch)
 *      ├─────┼─────────┼─────┤
 *      │ BL  │ Bottom  │ BR  │  (corners stay fixed)
 *      └─────┴─────────┴─────┘
 *    Behavior:
 *    - Corners: Never scale (preserve pixel-perfect)
 *    - Edges: Stretch along one axis (top/bottom: horizontal, left/right: vertical)
 *    - Center: Scales in both directions
 *    Benefit: UI elements scale to any size without visual distortion
 *
 * 3. Three-Slice Mode (Optional):
 *    Feature: Omit topHeight/bottomHeight for horizontal-only slicing
 *    Use Case: Horizontal buttons, progress bars
 *    Layout:
 *      ┌─────┬─────────────────┬─────┐
 *      │Left │     Center      │Right│
 *      └─────┴─────────────────┴─────┘
 *    Props: Only leftWidth + rightWidth required
 *
 * 4. Headless Default: FALSE ✅
 *    Decision: NineSlice participates in layout by default
 *    Reasoning:
 *    - NineSlice is a UI element (buttons, panels, containers)
 *    - Should affect parent container dimensions
 *    - Similar to View component (container semantics)
 *    Use Cases:
 *    - ✅ Layout-aware (default): Buttons, panels, dialogs, cards
 *    - ❌ Headless (optional): Background overlays, decorative frames
 *    Usage:
 *      <NineSlice texture="panel" leftWidth={16} rightWidth={16} width={200} height={100} />
 *      <NineSlice texture="frame" headless={true} />  // Decorative
 *
 * 5. Layout Size Provider:
 *    Implementation: Uses explicit width/height (required props)
 *    Reasoning:
 *    - NineSlice requires explicit dimensions (Phaser constructor param)
 *    - No auto-sizing (unlike Text)
 *    - Dimensions always known and stable
 *    __getLayoutSize:
 *      return { width: nineSlice.width, height: nineSlice.height }
 *    Note: getBounds() not needed (no rotation typically applied)
 *
 * 6. Slice Configuration:
 *    Required Props:
 *    - texture: string (texture key)
 *    - leftWidth: number (pixels)
 *    - rightWidth: number (pixels)
 *    - width: number (total width)
 *    - height: number (total height)
 *    Optional Props:
 *    - topHeight: number (9-slice mode, default: 0 for 3-slice)
 *    - bottomHeight: number (9-slice mode, default: 0 for 3-slice)
 *    - frame: string | number (texture atlas frame)
 *    Validation:
 *    - Width must be >= leftWidth + rightWidth
 *    - Height must be >= topHeight + bottomHeight
 *    - Slice widths/heights define source texture regions
 *
 * 7. Inner Bounds Feature:
 *    Purpose: Calculate content area excluding slices
 *    Use Case: Position children inside panel borders
 *    Calculation:
 *      innerBounds = {
 *        x: leftWidth,
 *        y: topHeight,
 *        width: totalWidth - leftWidth - rightWidth,
 *        height: totalHeight - topHeight - bottomHeight
 *      }
 *    Access:
 *      const ref = useRef<NineSliceRef>(null)
 *      <NineSlice ref={ref} ... />
 *      console.log(ref.current?.innerBounds)  // { x, y, width, height }
 *    Pattern: Useful for padding-aware content positioning
 *
 * 8. Ref Extension:
 *    Feature: NineSliceRef provides slice metadata
 *    Properties:
 *    - node: Phaser.GameObjects.NineSlice (the GameObject)
 *    - leftWidth, rightWidth, topHeight, bottomHeight: Slice dimensions
 *    - innerBounds: Content area calculation
 *    Usage:
 *      const panelRef = useRef<NineSliceRef>(null)
 *      // Access slice info for child positioning
 *      const { innerBounds } = panelRef.current
 *
 * 9. Common Patterns:
 *    Button:
 *      <NineSlice
 *        texture="button"
 *        leftWidth={16} rightWidth={16}
 *        topHeight={16} bottomHeight={16}
 *        width={200} height={60}
 *      >
 *        <Text text="Click Me" />
 *      </NineSlice>
 *    Dialog Box:
 *      <NineSlice
 *        texture="panel"
 *        leftWidth={32} rightWidth={32}
 *        topHeight={32} bottomHeight={32}
 *        width={400} height={300}
 *      >
 *        <View padding={32}>  {/* Padding matches slice sizes * }
 *          <Text text="Dialog Content" />
 *        </View>
 *      </NineSlice>
 *    Progress Bar (3-slice):
 *      <NineSlice
 *        texture="progressbar"
 *        leftWidth={8} rightWidth={8}
 *        width={progress * 200} height={20}
 *      />
 *
 * 10. Performance Considerations:
 *     - Efficient rendering (single draw call per NineSlice)
 *     - Texture atlases recommended (reduce texture switches)
 *     - Scaling performance: No geometry regeneration needed
 *     - Slice configuration: Calculated once on creation
 *     - Dynamic resizing: Efficiently handled by Phaser
 *
 * 11. Known Limitations:
 *     - Requires pre-designed 9-slice texture
 *     - Slice dimensions must match source texture layout exactly
 *     - Rotation not recommended (distorts slice alignment)
 *     - Can't animate slice dimensions (only width/height)
 *     - No rounded corner support (must be in texture)
 *
 * Implementation Status:
 * ======================
 * [✅] Phaser NineSlice creation with slice configuration
 * [✅] Transform props (position, scale, alpha, depth)
 * [✅] Layout system integration (__layoutProps, __getLayoutSize)
 * [✅] Width/height as layout props (explicit sizing)
 * [✅] Three-slice mode support (optional topHeight/bottomHeight)
 * [✅] NineSliceRef with innerBounds calculation
 * [✅] Slice dimension validation
 * [✅] Theme system integration
 * [✅] Dynamic resizing support (width/height patching)
 */
import type Phaser from 'phaser'
import type { LayoutProps, PhaserProps, TransformProps } from '../../core-props'
import type { HostCreator, HostPatcher } from '../../host'
import type { PropsDefaultExtension } from '../../types'
import { applyNineSliceProps } from '../appliers/applyNineSlice'
import { applyNineSliceLayout } from '../appliers/applyNineSliceLayout'
import { applyPhaserProps } from '../appliers/applyPhaser'
import { applyTransformProps } from '../appliers/applyTransform'
import { createNineSliceLayout } from '../creators/createNineSliceLayout'
import { createPhaser } from '../creators/createPhaser'
import { createTransform } from '../creators/createTransform'

/**
 * Inner bounds of a NineSlice - the content area excluding slices
 */
export interface NineSliceInnerBounds {
  /**
   * X offset from left edge (equals leftWidth)
   */
  x: number
  /**
   * Y offset from top edge (equals topHeight)
   */
  y: number
  /**
   * Width of inner content area (totalWidth - leftWidth - rightWidth)
   */
  width: number
  /**
   * Height of inner content area (totalHeight - topHeight - bottomHeight)
   */
  height: number
}

/**
 * Extended NineSlice reference with slice information and inner bounds
 */
export interface NineSliceRef {
  /**
   * The underlying Phaser NineSlice GameObject
   */
  node: Phaser.GameObjects.NineSlice | null
  /**
   * Width of the left slice in pixels
   */
  leftWidth: number
  /**
   * Width of the right slice in pixels
   */
  rightWidth: number
  /**
   * Height of the top slice in pixels (0 for 3-slice mode)
   */
  topHeight: number
  /**
   * Height of the bottom slice in pixels (0 for 3-slice mode)
   */
  bottomHeight: number
  /**
   * Inner content bounds excluding slices
   * Useful for positioning content within the NineSlice
   */
  innerBounds: NineSliceInnerBounds
}

/**
 * NineSlice-specific properties for texture and slice configuration
 */
export interface NineSliceSpecificProps {
  /**
   * Texture key to use for the NineSlice
   */
  texture: string

  /**
   * Optional tint to apply to the NineSlice
   */
  tint?: number | undefined

  /**
   * Optional frame within the texture atlas
   */
  frame?: string | number

  /**
   * Width of the left slice (in pixels of source texture)
   */
  leftWidth: number

  /**
   * Width of the right slice (in pixels of source texture)
   */
  rightWidth: number

  /**
   * Height of the top slice (in pixels of source texture)
   * Optional - omit for 3-slice mode (horizontal only)
   */
  topHeight?: number

  /**
   * Height of the bottom slice (in pixels of source texture)
   * Optional - omit for 3-slice mode (horizontal only)
   */
  bottomHeight?: number
}

/**
 * Base props for NineSlice - composing shared prop groups
 * Note: No InteractionProps - interaction should be handled by parent View container
 */
export interface NineSliceBaseProps
  extends TransformProps,
    PhaserProps,
    LayoutProps,
    NineSliceSpecificProps {}

/**
 * Props for NineSlice primitive - extends base props with JSX-specific props
 * Renamed to avoid conflict with custom NineSlice wrapper
 */
export interface NineSlicePrimitiveProps
  extends NineSliceBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.NineSlice> {}

/**
 * NineSlice creator - creates a Phaser NineSlice object
 */
export const nineSliceCreator: HostCreator<'NineSlice'> = (scene, props) => {
  // For width/height, use a small default that will be overridden by layout system
  // This prevents the NineSlice from being created with huge dimensions
  const initialWidth = typeof props.width === 'number' ? props.width : 64
  const initialHeight = typeof props.height === 'number' ? props.height : 64

  const nineSlice = scene.add.nineslice(
    props.x ?? 0,
    props.y ?? 0,
    props.texture,
    props.frame,
    initialWidth,
    initialHeight,
    props.leftWidth,
    props.rightWidth,
    props.topHeight,
    props.bottomHeight
  )
  nineSlice.setOrigin(0, 0) // Top-left origin for easier layout handling as it is in UI

  // Apply tint if provided
  if (props.tint !== undefined) {
    nineSlice.setTint(props.tint)
  }

  // Apply transform props (scale, rotation)
  createTransform(nineSlice, props)

  // Apply Phaser display props (alpha, depth, visible)
  createPhaser(nineSlice, props)

  // Setup layout system (props and size provider)
  createNineSliceLayout(nineSlice, props)

  return nineSlice
}

/**
 * NineSlice patcher - updates NineSlice properties
 */
export const nineSlicePatcher: HostPatcher<'NineSlice'> = (node, prev, next) => {
  // Apply transform props (position, rotation, scale)
  applyTransformProps(node, prev, next)

  // Apply Phaser display props (alpha, depth, visible)
  applyPhaserProps(node, prev, next)

  // Apply NineSlice-specific props (texture, frame, slice dimensions)
  applyNineSliceProps(node, prev, next)

  // Apply layout props and update size provider if needed
  applyNineSliceLayout(node, prev, next)
}
