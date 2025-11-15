/**
 * Layout property applier for updating container layout configuration
 */
import type { LayoutProps } from '../../core-props'
import { calculateLayout } from '../../layout/index'

/**
 * Applies layout property changes to a container
 * Handles width, height, direction, padding, margin updates
 * Always triggers layout recalculation since children may have changed
 * (e.g., text content, child dimensions, added/removed children)
 * @param node - Phaser container node
 * @param _prev - Previous layout props (unused, kept for API consistency)
 * @param next - New layout props
 */
export function applyLayoutProps(
  node: Phaser.GameObjects.Container & { __layoutProps?: LayoutProps },
  _prev: Partial<LayoutProps>,
  next: Partial<LayoutProps>
): void {
  // Update stored layout props
  node.__layoutProps = next as LayoutProps

  // Always recalculate layout
  // This is necessary because:
  // - Container props may have changed (width, padding, direction)
  // - Children may have changed (text grew, child added/removed, child resized)
  // - Parent patcher is called whenever children update via VDOM
  calculateLayout(node, next)
}
