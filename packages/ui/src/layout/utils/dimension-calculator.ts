/**
 * Dimension calculation utilities for layout system
 * Handles content size tracking and container dimension computation
 */
import type { EdgeInsets, LayoutProps } from '../../core-props'
import type { LayoutChild } from '../types'
import { clampSize, parseSize, resolveSize } from './size-resolver'

/**
 * Content dimension metrics
 */
export interface ContentMetrics {
  maxWidth: number
  maxHeight: number
  totalMainSize: number
}

/**
 * Padding values (normalized)
 */
export interface PaddingValues {
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * Calculate content dimensions based on children and layout direction
 * For flex children, uses a minimum default size to avoid chicken-egg sizing issues
 * @param children - Array of layout children with size and margin info
 * @param direction - Layout direction ('row', 'column', or 'stack')
 * @returns Content metrics including max dimensions and total main axis size
 */
export function calculateContentDimensions(
  children: LayoutChild[],
  direction: 'row' | 'column' | 'stack'
): ContentMetrics {
  const FLEX_CHILD_MIN_SIZE = 100 // Minimum size for flex children in content calculation
  let maxWidth = 0
  let maxHeight = 0
  let totalMainSize = 0

  for (const { size, margin, child } of children) {
    const marginTop = margin.top ?? 0
    const marginBottom = margin.bottom ?? 0
    const marginLeft = margin.left ?? 0
    const marginRight = margin.right ?? 0

    // Check if this child has flex property
    const hasFlex = (child.__layoutProps?.flex ?? 0) > 0

    if (direction === 'row') {
      const childWidth = hasFlex ? FLEX_CHILD_MIN_SIZE : size.width
      totalMainSize += marginLeft + childWidth + marginRight
      const childTotalHeight = marginTop + size.height + marginBottom
      maxHeight = Math.max(maxHeight, childTotalHeight)
    } else if (direction === 'column') {
      const childTotalWidth = marginLeft + size.width + marginRight
      maxWidth = Math.max(maxWidth, childTotalWidth)
      const childHeight = hasFlex ? FLEX_CHILD_MIN_SIZE : size.height
      totalMainSize += marginTop + childHeight + marginBottom
    } else if (direction === 'stack') {
      // For stack, track max dimensions (children overlay)
      const childTotalWidth = marginLeft + size.width + marginRight
      const childTotalHeight = marginTop + size.height + marginBottom
      maxWidth = Math.max(maxWidth, childTotalWidth)
      maxHeight = Math.max(maxHeight, childTotalHeight)
    }
  }

  return { maxWidth, maxHeight, totalMainSize }
}

/**
 * Calculate final container dimensions
 * @param props - Layout properties
 * @param metrics - Content metrics from calculateContentDimensions
 * @param padding - Normalized padding values
 * @param direction - Layout direction
 * @param gap - Gap between children
 * @param childCount - Number of children
 * @param parentSize - Parent dimensions for percentage resolution
 * @param parentPadding - Parent padding for 'fill' resolution
 * @returns Container width and height in pixels
 */
export function calculateContainerSize(
  props: LayoutProps,
  metrics: ContentMetrics,
  padding: PaddingValues,
  direction: 'row' | 'column' | 'stack',
  gap: number,
  childCount: number,
  parentSize?: { width: number; height: number },
  parentPadding?: { horizontal: number; vertical: number }
): { width: number; height: number } {
  // Add gaps to total main size (not applicable for stack)
  let totalMainSizeWithGaps = metrics.totalMainSize
  if (direction !== 'stack' && childCount > 1) {
    totalMainSizeWithGaps += gap * (childCount - 1)
  }

  // Calculate content-based default sizes
  const contentWidth =
    direction === 'row'
      ? totalMainSizeWithGaps + padding.left + padding.right
      : metrics.maxWidth + padding.left + padding.right

  const contentHeight =
    direction === 'row'
      ? metrics.maxHeight + padding.top + padding.bottom
      : totalMainSizeWithGaps + padding.top + padding.bottom

  // Resolve width
  const parsedWidth = parseSize(props.width)
  let width = resolveSize(parsedWidth, parentSize?.width, contentWidth, parentPadding?.horizontal)

  // Resolve height
  const parsedHeight = parseSize(props.height)
  let height = resolveSize(parsedHeight, parentSize?.height, contentHeight, parentPadding?.vertical)

  // Apply min/max constraints to container size
  // Note: parentSize is already the content-area of the parent container (after padding),
  // so we should NOT apply parentPadding again for percentage-based constraints
  width = clampSize(
    width,
    props.minWidth,
    props.maxWidth,
    parentSize?.width,
    contentWidth,
    undefined // Don't use parentPadding - parentSize is already content-area
  )
  height = clampSize(
    height,
    props.minHeight,
    props.maxHeight,
    parentSize?.height,
    contentHeight,
    undefined // Don't use parentPadding - parentSize is already content-area
  )

  return { width, height }
}

/**
 * Normalize padding from EdgeInsets or number to PaddingValues
 * @param padding - Edge insets (may be undefined, partial, or a single number for all sides)
 * @returns Normalized padding with all values defined
 */
export function normalizePadding(padding?: number | EdgeInsets): PaddingValues {
  if (typeof padding === 'number') {
    return {
      left: padding,
      top: padding,
      right: padding,
      bottom: padding,
    }
  }
  return {
    left: padding?.left ?? 0,
    top: padding?.top ?? 0,
    right: padding?.right ?? 0,
    bottom: padding?.bottom ?? 0,
  }
}
