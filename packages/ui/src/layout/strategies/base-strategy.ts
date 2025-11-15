/**
 * Base strategy interface for layout algorithms
 * Defines the contract for all layout strategies
 */
import type { LayoutChild, LayoutContext, Position } from '../types'
import type { ContentMetrics } from '../utils/dimension-calculator'

/**
 * Layout strategy interface
 * Each direction (row, column, stack) implements this interface
 */
export interface LayoutStrategy {
  /**
   * Calculate content dimensions for this layout strategy
   * @param children - Array of layout children
   * @param context - Layout context
   * @returns Content metrics (maxWidth, maxHeight, totalMainSize)
   */
  calculateMetrics(children: LayoutChild[], context: LayoutContext): ContentMetrics

  /**
   * Calculate position for a child at given index
   * @param child - Layout child
   * @param index - Child index
   * @param context - Layout context
   * @param currentMain - Current position on main axis
   * @returns Position (x, y) and updated currentMain value
   */
  positionChild(
    child: LayoutChild,
    index: number,
    context: LayoutContext,
    currentMain: number
  ): { position: Position; nextMain: number }
}

/**
 * Abstract base class for layout strategies
 * Provides common functionality for all strategies
 */
export abstract class BaseLayoutStrategy implements LayoutStrategy {
  abstract calculateMetrics(children: LayoutChild[], context: LayoutContext): ContentMetrics

  abstract positionChild(
    child: LayoutChild,
    index: number,
    context: LayoutContext,
    currentMain: number
  ): { position: Position; nextMain: number }

  /**
   * Helper: Normalize margin values
   * @param child - Layout child
   * @returns Normalized margin values
   */
  protected getMarginValues(child: LayoutChild) {
    return {
      top: child.margin.top ?? 0,
      right: child.margin.right ?? 0,
      bottom: child.margin.bottom ?? 0,
      left: child.margin.left ?? 0,
    }
  }

  /**
   * Helper: Calculate total child size including margins
   * @param child - Layout child
   * @returns Total width and height including margins
   */
  protected getTotalChildSize(child: LayoutChild) {
    const margin = this.getMarginValues(child)
    return {
      width: margin.left + child.size.width + margin.right,
      height: margin.top + child.size.height + margin.bottom,
    }
  }
}
