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
   * For flex children, uses a minimum default size to avoid chicken-egg sizing issues
   * @param children - Array of layout children
   * @param context - Layout context
   * @returns Content metrics
   */
  calculateMetrics(children: LayoutChild[], _context: LayoutContext): ContentMetrics {
    const FLEX_CHILD_MIN_SIZE = 100 // Minimum size for flex children in content calculation
    let maxHeight = 0
    let totalMainSize = 0

    for (const child of children) {
      const total = this.getTotalChildSize(child)
      maxHeight = Math.max(maxHeight, total.height)

      // Check if this child has flex property
      const hasFlex = (child.child.__layoutProps?.flex ?? 0) > 0
      // If flex child already has a resolved size (> 10), use it; otherwise use minimum
      const childWidth = hasFlex && child.size.width <= 10 ? FLEX_CHILD_MIN_SIZE : total.width

      totalMainSize += childWidth
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
    const isHeadless = child.child.__layoutProps?.headless

    let x: number
    let y: number
    let nextMain: number

    if (isHeadless) {
      // Headless: calculate position directly using alignItems/justifyContent on full parent size
      const parentWidth = context.parentSize?.width ?? context.contentArea.width
      const parentHeight = context.parentSize?.height ?? context.contentArea.height

      // justifyContent on main axis (horizontal)
      const justify = context.containerProps.justifyContent ?? 'start'
      let mainAxisOffset = 0
      if (justify === 'center') {
        mainAxisOffset = (parentWidth - child.size.width) / 2
      } else if (justify === 'end') {
        mainAxisOffset = parentWidth - child.size.width
      }
      x = mainAxisOffset

      // alignItems on cross axis (vertical)
      const crossAxisOffset = calculateAlignItems(
        context.containerProps.alignItems,
        parentHeight,
        child.size.height,
        0,
        0
      )
      y = crossAxisOffset

      // Don't advance currentMain for headless
      nextMain = currentMain
    } else {
      // Normal: use container padding and contentArea
      currentMain += margin.left
      x = context.padding.left + currentMain

      const alignOffset = calculateAlignItems(
        context.containerProps.alignItems,
        context.contentArea.height,
        child.size.height,
        margin.top,
        margin.bottom
      )
      y = context.padding.top + alignOffset

      nextMain = currentMain + child.size.width + margin.right
    }

    return {
      position: { x, y },
      nextMain,
    }
  }
}
