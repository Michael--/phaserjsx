/**
 * Spacing and alignment calculation utilities
 * Handles justifyContent and alignItems positioning logic
 */
import type { LayoutProps } from '../../core-props'

/**
 * Justify content calculation result
 */
export interface JustifyResult {
  mainStart: number
  spaceBetween: number
}

/**
 * Calculate main axis starting position and spacing between children
 * @param justifyContent - Justify content value
 * @param remainingSpace - Space remaining after children are placed
 * @param childCount - Number of children
 * @returns Main axis starting offset and spacing between children
 */
export function calculateJustifyContent(
  justifyContent: LayoutProps['justifyContent'],
  remainingSpace: number,
  childCount: number
): JustifyResult {
  let mainStart = 0
  let spaceBetween = 0

  switch (justifyContent) {
    case 'start':
      mainStart = 0
      break
    case 'center':
      mainStart = Math.max(0, remainingSpace / 2)
      break
    case 'end':
      mainStart = Math.max(0, remainingSpace)
      break
    case 'space-between':
      mainStart = 0
      spaceBetween = childCount > 1 ? remainingSpace / (childCount - 1) : 0
      break
    case 'space-around':
      spaceBetween = childCount > 0 ? remainingSpace / childCount : 0
      mainStart = spaceBetween / 2
      break
    case 'space-evenly':
      spaceBetween = childCount > 0 ? remainingSpace / (childCount + 1) : 0
      mainStart = spaceBetween
      break
    default:
      // 'start' is default
      mainStart = 0
      break
  }

  return { mainStart, spaceBetween }
}

/**
 * Calculate cross axis position for a child
 * @param alignItems - Align items value
 * @param contentArea - Available space on cross axis
 * @param childSize - Size of child on cross axis
 * @param marginStart - Margin at start of cross axis (top for row, left for column)
 * @param marginEnd - Margin at end of cross axis (bottom for row, right for column)
 * @returns Cross axis position
 */
export function calculateAlignItems(
  alignItems: LayoutProps['alignItems'],
  contentArea: number,
  childSize: number,
  marginStart: number,
  marginEnd: number
): number {
  switch (alignItems) {
    case 'start':
      return marginStart
    case 'center':
      return (contentArea - childSize) / 2
    case 'end':
      return contentArea - childSize - marginEnd
    case 'stretch':
      // Stretch: position at start (size is stretched in layout engine)
      return marginStart
    default:
      return marginStart
  }
}
