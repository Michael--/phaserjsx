/**
 * Column layout strategy (vertical stacking)
 * Like SwiftUI's VStack
 */
import type { LayoutChild, LayoutContext, LayoutLine, Position } from '../types'
import type { ContentMetrics } from '../utils/dimension-calculator'
import { parseSize, resolveSize } from '../utils/size-resolver'
import { calculateAlignItems } from '../utils/spacing-calculator'
import { BaseLayoutStrategy } from './base-strategy'

/**
 * Column layout strategy - stacks children vertically
 */
export class ColumnLayoutStrategy extends BaseLayoutStrategy {
  /**
   * Calculate content dimensions for column layout
   * For flex children, uses a minimum default size to avoid chicken-egg sizing issues
   * @param children - Array of layout children
   * @param context - Layout context
   * @returns Content metrics
   */
  calculateMetrics(children: LayoutChild[], _context: LayoutContext): ContentMetrics {
    const FLEX_CHILD_MIN_SIZE = 100 // Minimum size for flex children in content calculation
    let maxWidth = 0
    let totalMainSize = 0

    for (const child of children) {
      const total = this.getTotalChildSize(child)
      maxWidth = Math.max(maxWidth, total.width)

      // Check if this child participates in flexbox (flex, flexShrink, or flexBasis)
      const props = child.child.__layoutProps
      const isFlexItem =
        (props?.flex !== undefined && props.flex > 0) ||
        props?.flexShrink !== undefined ||
        props?.flexBasis !== undefined
      // If flex child already has a resolved size (> 10), use it; otherwise use minimum
      const childHeight = isFlexItem && child.size.height <= 10 ? FLEX_CHILD_MIN_SIZE : total.height

      totalMainSize += childHeight
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
    const isHeadless = child.child.__layoutProps?.headless

    let x: number
    let y: number
    let nextMain: number

    if (isHeadless) {
      // Headless: calculate position directly using alignItems/justifyContent on full parent size
      const parentWidth = context.parentSize?.width ?? context.contentArea.width
      const parentHeight = context.parentSize?.height ?? context.contentArea.height

      // justifyContent on main axis (vertical) - manual calculation
      const justify = context.containerProps.justifyContent ?? 'start'
      let mainAxisOffset = 0
      if (justify === 'center') {
        mainAxisOffset = (parentHeight - child.size.height) / 2
      } else if (justify === 'end') {
        mainAxisOffset = parentHeight - child.size.height
      }
      // start and space-* variants use 0 for single item
      y = mainAxisOffset

      // alignItems on cross axis (horizontal)
      const crossAxisOffset = calculateAlignItems(
        context.containerProps.alignItems,
        parentWidth,
        child.size.width,
        0,
        0
      )
      x = crossAxisOffset

      // Don't advance currentMain for headless (they don't participate in flow)
      nextMain = currentMain
    } else {
      // Normal: use container padding and contentArea
      currentMain += margin.top
      y = context.padding.top + currentMain

      const alignOffset = calculateAlignItems(
        context.containerProps.alignItems,
        context.contentArea.width,
        child.size.width,
        margin.left,
        margin.right
      )
      x = context.padding.left + alignOffset

      nextMain = currentMain + child.size.height + margin.bottom
    }

    return {
      position: { x, y },
      nextMain,
    }
  }

  /**
   * Wrap children into lines based on available height
   * Used when flexWrap is 'wrap' or 'wrap-reverse'
   * @param children - Layout children to wrap
   * @param availableHeight - Available height for each line
   * @param gap - Gap between children
   * @returns Array of layout lines
   */
  wrapChildren(children: LayoutChild[], availableHeight: number, gap: number): LayoutLine[] {
    const lines: LayoutLine[] = []
    let currentLine: LayoutChild[] = []
    let currentLineHeight = 0
    let currentLineWidth = 0

    for (const child of children) {
      // Skip headless children in wrapping calculation
      if (child.child.__layoutProps?.headless) {
        continue
      }

      const margin = this.getMarginValues(child)
      const props = child.child.__layoutProps

      // For flex items with no size, use flexBasis or minHeight as hint for wrapping
      let effectiveHeight = child.size.height
      if (effectiveHeight <= 0 && props) {
        if (props.flexBasis !== undefined && typeof props.flexBasis === 'number') {
          effectiveHeight = props.flexBasis
        } else if (props.minHeight !== undefined) {
          // Resolve minHeight SizeValue to number
          const parsed = parseSize(props.minHeight)
          effectiveHeight = resolveSize(parsed, availableHeight, 100, undefined)
        } else if (props.flex && props.flex > 0) {
          // Use a reasonable default for flex items with no size hint
          effectiveHeight = 100
        }
      }

      const childHeight = effectiveHeight + margin.top + margin.bottom
      const childWidth = child.size.width + margin.left + margin.right

      const gapSpace = currentLine.length > 0 ? gap : 0
      const requiredSpace = currentLineHeight + childHeight + gapSpace

      // Check if we need to wrap to a new line (column)
      if (requiredSpace > availableHeight && currentLine.length > 0) {
        // Save current line
        lines.push({
          children: currentLine,
          mainAxisSize: currentLineHeight,
          crossAxisSize: currentLineWidth,
        })

        // Start new line
        currentLine = [child]
        currentLineHeight = childHeight
        currentLineWidth = childWidth
      } else {
        // Add to current line
        currentLine.push(child)
        currentLineHeight = requiredSpace
        currentLineWidth = Math.max(currentLineWidth, childWidth)
      }
    }

    // Add remaining line
    if (currentLine.length > 0) {
      lines.push({
        children: currentLine,
        mainAxisSize: currentLineHeight,
        crossAxisSize: currentLineWidth,
      })
    }

    return lines
  }
}
