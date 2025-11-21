/**
 * View component - Phaser Container with background Graphics and layout system
 * Status: IMPLEMENTED ✅
 *
 * Design Overview:
 * ================
 *
 * 1. Component Role: LAYOUT CONTAINER
 *    Purpose: Primary layout primitive for UI composition
 *    Composition: Phaser.Container + Background Graphics (optional)
 *    Responsibilities:
 *    - Layout orchestration (flexbox-style positioning of children)
 *    - Visual styling (background color, borders, corner radius)
 *    - Gesture handling (touch/mouse interaction)
 *    - Dimension management (defines its own size + provides context for children)
 *
 * 2. Headless Behavior: NEVER HEADLESS ⚠️
 *    Decision: View cannot be headless (always participates in layout)
 *    Reasoning:
 *    - View IS the layout system - it defines layout context for children
 *    - Background Graphics has special role (__isBackground flag)
 *    - Graphics is internal to View, excluded from child layout calculations
 *    - If you need non-layout container, use raw Phaser.Container directly
 *
 * 3. Layout System Architecture:
 *    Two-part system:
 *    A) Background Graphics (special role):
 *       - Defines View dimensions (not a layout child!)
 *       - Marked with __isBackground = true
 *       - Filtered out in layout calculations (see isLayoutChild helper)
 *       - Automatically resized to match container dimensions
 *    B) Layout Engine:
 *       - Processes children (Views, Text, Images, etc.)
 *       - Applies flexbox-style layout (row/column/stack)
 *       - Respects headless flag on children
 *       - Updates child positions/sizes based on layout props
 *
 * 4. Background Graphics vs. Graphics Component:
 *    Distinction:
 *    - View Background: Internal, auto-managed, defines dimensions, __isBackground=true
 *    - Graphics Component: User-facing, custom shapes, typically headless=true
 *    - Both use Phaser.Graphics but completely different purposes
 *
 * 5. Layout Size Provider:
 *    Implementation: __getLayoutSize returns explicit or calculated dimensions
 *    Behavior:
 *    - Explicit width/height: Use those values
 *    - Auto-size (undefined): Calculate from children + padding
 *    - Percentage/fill: Resolve from parent context
 *    - Critical: Background Graphics updates to match final size
 *
 * 6. Gesture System Integration:
 *    Features:
 *    - enableGestures: true enables touch/mouse interaction
 *    - Hit area automatically sized to container dimensions
 *    - Updated after layout recalculation (deferred queue)
 *    - Supports: onTouch, onTouchMove, onDoubleTap, onLongPress
 *    - Cross-platform (transparent mouse/touch support)
 *
 * 7. Styling Props:
 *    Background:
 *    - backgroundColor/backgroundAlpha: Fill color
 *    - cornerRadius: Rounded corners (number or per-corner object)
 *    - borderColor/borderWidth/borderAlpha: Stroke
 *    Auto-defaults:
 *    - backgroundAlpha defaults to 1 if backgroundColor set
 *    - borderWidth defaults to 1 if borderColor set
 *
 * 8. Common Patterns:
 *    Layout Container:
 *      <View direction="row" gap={10} padding={20}>
 *        <View flex={1}>Left</View>
 *        <View flex={2}>Right</View>
 *      </View>
 *    Styled Box:
 *      <View backgroundColor={0x3498db} cornerRadius={8} padding={16}>
 *        <Text text="Card Content" />
 *      </View>
 *    Interactive Area:
 *      <View enableGestures={true} onTouch={() => console.log('clicked')}>
 *        <Text text="Button" />
 *      </View>
 *
 * 9. Performance Considerations:
 *    - Background Graphics redrawn only when visual props change
 *    - Layout calculations batched (LayoutBatchQueue)
 *    - Gesture hit areas updated in deferred queue (post-layout)
 *    - Overflow masking (overflow="hidden") adds Phaser mask overhead
 *
 * 10. Known Limitations:
 *     - Background Graphics cannot be independently positioned/rotated
 *     - Overflow masking doesn't support rounded corners (Phaser limitation)
 *     - Nested View layout recalculations can be expensive (use sparingly)
 *     - Gesture system requires scene pointer plugin (auto-enabled)
 *
 * Implementation Status:
 * ======================
 * [✅] Phaser Container creation
 * [✅] Background Graphics with styling (color, border, radius)
 * [✅] Layout system integration (__layoutProps, __getLayoutSize)
 * [✅] Transform props (position, rotation, scale, alpha)
 * [✅] Gesture system (enableGestures, interaction callbacks)
 * [✅] Auto-defaults for background/border alpha
 * [✅] Overflow masking support
 * [✅] Theme system integration
 * [✅] Deferred layout queue for gesture updates
 */
import Phaser from 'phaser'
import type { BackgroundProps, GestureProps, LayoutProps, TransformProps } from '../core-props'
import { DebugLogger } from '../dev-config'
import type { HostCreator, HostPatcher } from '../host'
import type { PropsContainerExtension, PropsDefaultExtension } from '../types'
import { applyBackgroundProps } from './appliers/applyBackground'
import { applyGesturesProps } from './appliers/applyGestures'
import { applyLayoutProps } from './appliers/applyLayout'
import { applyTransformProps } from './appliers/applyTransform'
import { createBackground } from './creators/createBackground'
import { createGestures } from './creators/createGestures'
import { createLayout } from './creators/createLayout'
import { createTransform } from './creators/createTransform'

/**
 * Normalize background props - apply auto-defaults for alpha and border width
 * @param props - Original props
 * @returns Normalized props with auto-defaults applied
 */
function normalizeBackgroundProps<T>(props: T): T {
  // Only process if props contain background/border properties
  const bgProps = props as unknown as Partial<BackgroundProps>
  const hasBackground = bgProps.backgroundColor !== undefined
  const hasBorder = bgProps.borderColor !== undefined

  // If no background/border props, return as-is
  if (!hasBackground && !hasBorder) {
    return props
  }

  // Only apply defaults if the prop is explicitly undefined or 0 (theme default)
  // This allows users to override with explicit values
  const normalized = { ...props } as T & Partial<BackgroundProps>

  if (hasBackground && (bgProps.backgroundAlpha === undefined || bgProps.backgroundAlpha === 0)) {
    normalized.backgroundAlpha = 1
  }

  if (hasBorder) {
    if (bgProps.borderWidth === undefined || bgProps.borderWidth === 0) {
      normalized.borderWidth = 1
    }
    if (bgProps.borderAlpha === undefined || bgProps.borderAlpha === 0) {
      normalized.borderAlpha = 1
    }
  }

  return normalized as T
}

/**
 * Base props for View - composing shared prop groups
 */
export interface ViewBaseProps extends TransformProps, LayoutProps, BackgroundProps, GestureProps {}

/**
 * Props for View (Container) component - extends base props with JSX-specific props
 */
export interface ViewProps
  extends ViewBaseProps,
    PropsDefaultExtension<Phaser.GameObjects.Container>,
    PropsContainerExtension {}

/**
 * View creator - creates a Phaser Container with optional background and interaction
 */
export const viewCreator: HostCreator<'View'> = (scene, props) => {
  // Debug: Log props to verify theme values
  if (props.backgroundColor !== undefined || props.cornerRadius !== undefined) {
    DebugLogger.log('theme', 'View Creator - Props received:', {
      backgroundColor: props.backgroundColor,
      cornerRadius: props.cornerRadius,
      width: props.width,
      height: props.height,
    })
  }

  // Normalize props early - apply auto-defaults for background/border
  const normalizedProps = normalizeBackgroundProps(props)

  const container = scene.add.container(normalizedProps.x ?? 0, normalizedProps.y ?? 0)

  // Apply transform props (visible, depth, alpha, scale, rotation)
  createTransform(container, normalizedProps)

  // Add background if backgroundColor is provided
  createBackground(
    scene,
    container as typeof container & { __background?: Phaser.GameObjects.Graphics },
    normalizedProps
  )

  // Setup layout system (props and size provider)
  // Must be before createGestures so __getLayoutSize is available
  createLayout(container, normalizedProps)

  // Setup gesture system (high-level touch/mouse gestures)
  createGestures(scene, container, normalizedProps)

  // Debug: Log layout props storage
  DebugLogger.log(
    'layout',
    'View creator storing __layoutProps with padding:',
    normalizedProps.padding
  )

  return container
}

/**
 * View patcher - updates View properties
 */
export const viewPatcher: HostPatcher<'View'> = (node, prev, next) => {
  // Normalize props early - apply auto-defaults for background/border
  const normalizedPrev = normalizeBackgroundProps(prev)
  const normalizedNext = normalizeBackgroundProps(next)

  // Apply transform props (position, rotation, scale, alpha, depth, visibility)
  applyTransformProps(node, normalizedPrev, normalizedNext)

  // Background updates
  const container = node as Phaser.GameObjects.Container & {
    __background?: Phaser.GameObjects.Graphics
  }

  applyBackgroundProps(container, normalizedPrev, normalizedNext)

  // Gesture event handlers (high-level touch/mouse gestures)
  // Safety check: ensure container has valid scene before applying gestures
  if (container.scene && container.scene.data) {
    applyGesturesProps(container.scene, container, normalizedPrev, normalizedNext)
  }

  // Apply layout props and recalculate if needed
  applyLayoutProps(container, normalizedPrev, normalizedNext)
}
