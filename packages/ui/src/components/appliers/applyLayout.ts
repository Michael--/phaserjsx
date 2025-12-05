/**
 * Layout property applier for updating container layout configuration
 */
import equal from 'fast-deep-equal'
import type { BackgroundProps, LayoutProps } from '../../core-props'
import { getGestureManager } from '../../gestures/gesture-manager'
import { calculateLayout, type LayoutSize } from '../../layout/index'

/**
 * Updates gesture hit area based on current layout size
 * Called after layout recalculation to sync hit area with actual container size
 * @param node - Container with potential gesture registration
 */
function updateGestureHitAreaIfNeeded(node: Phaser.GameObjects.Container): void {
  const containerWithLayout = node as typeof node & {
    __getLayoutSize?: () => LayoutSize
    scene: Phaser.Scene
  }

  // Only update if container has gesture system enabled and layout size available
  if (!containerWithLayout.__getLayoutSize) return

  try {
    const manager = getGestureManager(containerWithLayout.scene)
    const size = containerWithLayout.__getLayoutSize()
    const hitArea = new Phaser.Geom.Rectangle(0, 0, size.width, size.height)
    manager.updateHitArea(node, hitArea)
  } catch {
    // Gesture manager or container not registered, ignore
  }
}

/**
 * Layout-relevant props that trigger layout recalculation when changed
 */
const LAYOUT_RELEVANT_PROPS: (keyof LayoutProps)[] = [
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flex',
  'margin',
  'padding',
  'gap',
  'direction',
  'justifyContent',
  'alignItems',
  'overflow',
]

/**
 * Object props that need deep comparison
 */
const DEEP_COMPARE_PROPS = new Set(['margin', 'padding'])

/**
 * Check if any layout-relevant prop changed
 * Uses shallow equality for primitives and deep equality for objects
 * @param prev - Previous props
 * @param next - New props
 * @returns True if any layout prop changed
 */
function hasLayoutPropsChanged(
  prev: Partial<LayoutProps & BackgroundProps>,
  next: Partial<LayoutProps & BackgroundProps>
): boolean {
  for (const prop of LAYOUT_RELEVANT_PROPS) {
    const oldVal = prev[prop]
    const newVal = next[prop]

    // Use deep comparison for object props (margin, padding)
    if (DEEP_COMPARE_PROPS.has(prop as string)) {
      if (!equal(oldVal, newVal)) {
        return true
      }
    } else {
      // Shallow comparison for primitives
      if (oldVal !== newVal) {
        return true
      }
    }
  }
  return false
}

/**
 * Calculates parent size and padding from parent container's layout
 * Falls back to viewport size for root containers without a parent
 * @param node - Container node to get parent info for
 * @returns Parent size and padding if parent is a layout container
 */
function getParentLayoutContext(node: Phaser.GameObjects.Container): {
  parentSize?: { width: number; height: number }
  parentPadding?: { horizontal: number; vertical: number }
} {
  const parent = node.parentContainer as
    | (Phaser.GameObjects.Container & {
        __layoutProps?: LayoutProps
        __getLayoutSize?: () => LayoutSize
      })
    | undefined

  // If has layout parent, use its content-area
  if (parent && parent.__layoutProps && parent.__getLayoutSize) {
    const parentSize = parent.__getLayoutSize()
    const padding = parent.__layoutProps.padding ?? 0
    const normPadding =
      typeof padding === 'number'
        ? { left: padding, right: padding, top: padding, bottom: padding }
        : {
            left: padding.left ?? 0,
            right: padding.right ?? 0,
            top: padding.top ?? 0,
            bottom: padding.bottom ?? 0,
          }

    return {
      parentSize: {
        width: parentSize.width - normPadding.left - normPadding.right,
        height: parentSize.height - normPadding.top - normPadding.bottom,
      },
      // Parent already provides content-area, no padding offset needed
    }
  }

  // Fallback: Root container without layout parent - use viewport as parent size
  // This allows percentage-based sizing/constraints to work on root containers
  if (node.scene) {
    return {
      parentSize: {
        width: node.scene.scale.width,
        height: node.scene.scale.height,
      },
    }
  }

  return {}
}

/**
 * Applies layout property changes to a container
 * Handles width, height, direction, padding, margin updates
 * Triggers layout recalculation when:
 * 1. Layout-relevant props changed, OR
 * 2. This is being called from host.patch (which means VDOM will handle child changes)
 * @param node - Phaser container node
 * @param prev - Previous layout props
 * @param next - New layout props
 */
export function applyLayoutProps(
  node: Phaser.GameObjects.Container & { __layoutProps?: LayoutProps & BackgroundProps },
  prev: Partial<LayoutProps & BackgroundProps>,
  next: Partial<LayoutProps & BackgroundProps>
): void {
  // Update stored layout props (includes visible for display control)
  node.__layoutProps = next as LayoutProps & BackgroundProps

  // IMPORTANT: We only recalculate if container's own props changed
  // Children changes are handled by VDOM patchVNode() which has smarter detection
  // This prevents double-calculation while still catching container prop changes
  if (hasLayoutPropsChanged(prev, next)) {
    // Get parent layout context for percentage/fill resolution
    const { parentSize, parentPadding } = getParentLayoutContext(node)
    calculateLayout(node, next, parentSize, parentPadding)
    // Update gesture hit area after layout recalculation
    // This ensures hit area matches actual container size (important for auto-sized containers)
    updateGestureHitAreaIfNeeded(node)
  }
  // Note: If children changed (text content, child added/removed, etc.),
  // the VDOM layer will detect that and call calculateLayout separately
}
