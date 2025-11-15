/**
 * Row layout strategy (horizontal stacking)
 * Like SwiftUI's HStack
 */
import type { LayoutChild, LayoutContext, Position } from '../types'
import type { ContentMetrics } from '../utils/dimension-calculator'
import { calculateAlignItems } from '../utils/spacing-calculator'
import { BaseLayoutStrategy } from './base-strategy'

/**
 * Row layout strategy - stacks children horizontally
 */
export class RowLayoutStrategy extends BaseLayoutStrategy {
  /**
   * Calculate content dimensions for row layout
   * @param children - Array of layout children
   * @param context - Layout context
   * @returns Content metrics
   */
  calculateMetrics(children: LayoutChild[], _context: LayoutContext): ContentMetrics {
    let maxHeight = 0
    let totalMainSize = 0

    for (const child of children) {
      const total = this.getTotalChildSize(child)
      maxHeight = Math.max(maxHeight, total.height)
      totalMainSize += total.width
    }

    return {
      maxWidth: 0, // Not used for row
      maxHeight,
      totalMainSize,
    }
  }

  /**
   * Position a child in row layout
   * @param child - Layout child
   * @param _index - Child index (unused for row layout)
   * @param context - Layout context
   * @param currentMain - Current X position
   * @returns Position and next main axis value
   */
  positionChild(
    child: LayoutChild,
    _index: number,
    context: LayoutContext,
    currentMain: number
  ): { position: Position; nextMain: number } {
    const margin = this.getMarginValues(child)

    // Main axis (horizontal)
    currentMain += margin.left
    const x = context.padding.left + currentMain

    // Cross axis (vertical) - alignItems
    const y =
      context.padding.top +
      calculateAlignItems(
        context.containerProps.alignItems,
        context.contentArea.height,
        child.size.height,
        margin.top,
        margin.bottom
      )

    const nextMain = currentMain + child.size.width + margin.right

    return {
      position: { x, y },
      nextMain,
    }
  }
}
