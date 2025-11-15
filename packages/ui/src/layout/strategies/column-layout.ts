/**
 * Column layout strategy (vertical stacking)
 * Like SwiftUI's VStack
 */
import type { LayoutChild, LayoutContext, Position } from '../types'
import type { ContentMetrics } from '../utils/dimension-calculator'
import { calculateAlignItems } from '../utils/spacing-calculator'
import { BaseLayoutStrategy } from './base-strategy'

/**
 * Column layout strategy - stacks children vertically
 */
export class ColumnLayoutStrategy extends BaseLayoutStrategy {
  /**
   * Calculate content dimensions for column layout
   * @param children - Array of layout children
   * @param context - Layout context
   * @returns Content metrics
   */
  calculateMetrics(children: LayoutChild[], _context: LayoutContext): ContentMetrics {
    let maxWidth = 0
    let totalMainSize = 0

    for (const child of children) {
      const total = this.getTotalChildSize(child)
      maxWidth = Math.max(maxWidth, total.width)
      totalMainSize += total.height
    }

    return {
      maxWidth,
      maxHeight: 0, // Not used for column
      totalMainSize,
    }
  }

  /**
   * Position a child in column layout
   * @param child - Layout child
   * @param _index - Child index (unused for column layout)
   * @param context - Layout context
   * @param currentMain - Current Y position
   * @returns Position and next main axis value
   */
  positionChild(
    child: LayoutChild,
    _index: number,
    context: LayoutContext,
    currentMain: number
  ): { position: Position; nextMain: number } {
    const margin = this.getMarginValues(child)

    // Main axis (vertical)
    currentMain += margin.top
    const y = context.padding.top + currentMain

    // Cross axis (horizontal) - alignItems
    const x =
      context.padding.left +
      calculateAlignItems(
        context.containerProps.alignItems,
        context.contentArea.width,
        child.size.width,
        margin.left,
        margin.right
      )

    const nextMain = currentMain + child.size.height + margin.bottom

    return {
      position: { x, y },
      nextMain,
    }
  }
}
