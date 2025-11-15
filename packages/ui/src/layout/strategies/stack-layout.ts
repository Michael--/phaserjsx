/**
 * Stack layout strategy (overlay positioning)
 * Like SwiftUI's ZStack - all children positioned at same location
 */
import type { LayoutChild, LayoutContext, Position } from '../types'
import type { ContentMetrics } from '../utils/dimension-calculator'
import { BaseLayoutStrategy } from './base-strategy'

/**
 * Stack layout strategy - overlays all children at the same position
 */
export class StackLayoutStrategy extends BaseLayoutStrategy {
  /**
   * Calculate content dimensions for stack layout
   * For stack, we track max dimensions as children overlay
   * @param children - Array of layout children
   * @param context - Layout context
   * @returns Content metrics
   */
  calculateMetrics(children: LayoutChild[], _context: LayoutContext): ContentMetrics {
    let maxWidth = 0
    let maxHeight = 0

    for (const child of children) {
      const total = this.getTotalChildSize(child)
      maxWidth = Math.max(maxWidth, total.width)
      maxHeight = Math.max(maxHeight, total.height)
    }

    return {
      maxWidth,
      maxHeight,
      totalMainSize: 0, // Not applicable for stack
    }
  }

  /**
   * Position a child in stack layout
   * All children positioned at same location, aligned via alignItems
   * @param child - Layout child
   * @param _index - Child index (unused for stack layout)
   * @param context - Layout context
   * @param currentMain - Current position (unused for stack)
   * @returns Position and unchanged currentMain
   */
  positionChild(
    child: LayoutChild,
    _index: number,
    context: LayoutContext,
    currentMain: number
  ): { position: Position; nextMain: number } {
    const margin = this.getMarginValues(child)
    const { alignItems } = context.containerProps

    let x = 0
    let y = 0

    // Position based on alignItems (applies to both axes for stack)
    switch (alignItems) {
      case 'start':
        x = context.padding.left + margin.left
        y = context.padding.top + margin.top
        break
      case 'center':
        x = context.padding.left + (context.contentArea.width - child.size.width) / 2
        y = context.padding.top + (context.contentArea.height - child.size.height) / 2
        break
      case 'end':
        x = context.padding.left + context.contentArea.width - child.size.width - margin.right
        y = context.padding.top + context.contentArea.height - child.size.height - margin.bottom
        break
      case 'stretch':
        // TODO: Implement stretch - for now behave like start
        x = context.padding.left + margin.left
        y = context.padding.top + margin.top
        break
      default:
        x = context.padding.left + margin.left
        y = context.padding.top + margin.top
        break
    }

    return {
      position: { x, y },
      nextMain: currentMain, // Stack doesn't advance main axis
    }
  }
}
