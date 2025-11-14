/**
 * Layout property applier for updating container layout configuration
 */
import type { LayoutProps } from '../../core-props'
import { calculateLayout } from '../../layout'

/**
 * Applies layout property changes to a container
 * Handles width, height, direction, padding, margin updates
 * Triggers layout recalculation if needed
 * @param node - Phaser container node
 * @param prev - Previous layout props
 * @param next - New layout props
 */
export function applyLayoutProps(
  node: Phaser.GameObjects.Container & { __layoutProps?: LayoutProps },
  prev: Partial<LayoutProps>,
  next: Partial<LayoutProps>
): void {
  // Check if any layout prop changed
  const layoutChanged =
    prev.width !== next.width ||
    prev.height !== next.height ||
    prev.direction !== next.direction ||
    JSON.stringify(prev.padding) !== JSON.stringify(next.padding) ||
    JSON.stringify(prev.margin) !== JSON.stringify(next.margin)

  if (!layoutChanged) {
    return
  }

  // Update stored layout props
  node.__layoutProps = next as LayoutProps

  // Recalculate layout with new props
  calculateLayout(node, next)
}
