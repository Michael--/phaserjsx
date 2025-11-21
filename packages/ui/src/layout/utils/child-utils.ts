/**
 * Utility functions for working with layout children
 */
import type Phaser from 'phaser'
import type { EdgeInsets, LayoutProps } from '../../core-props'
import { DebugLogger } from '../../dev-config'
import type { GameObjectWithLayout, LayoutChild, LayoutSize } from '../types'
import { parseSize, resolveSize } from './size-resolver'

/**
 * Check if a child should participate in layout calculations
 * @param child - Child game object
 * @returns True if child should be included in layout
 */
export function isLayoutChild(child: GameObjectWithLayout): boolean {
  // Skip background graphics (special role - defines container dimensions)
  if (child.__isBackground) return false

  // Skip headless objects (decorative/absolute positioned)
  if (child.__layoutProps?.headless === true) return false

  // Require __getLayoutSize for layout participation
  return typeof child.__getLayoutSize === 'function'
}

/**
 * Get effective margin for a child
 * Normalizes margin to EdgeInsets (supports number for all sides)
 * @param child - Child game object
 * @returns Edge insets
 */
export function getMargin(child: GameObjectWithLayout): EdgeInsets {
  const margin = child.__layoutProps?.margin
  if (typeof margin === 'number') {
    return { top: margin, right: margin, bottom: margin, left: margin }
  }
  return margin ?? {}
}

/**
 * Get effective size of a child
 * Calls __getLayoutSize if available, otherwise falls back to layoutProps or default
 * Note: String sizes (percentages) are resolved later with parent context
 * @param child - Child game object
 * @param parentSize - Optional parent dimensions for percentage resolution
 * @param parentPadding - Optional parent padding for 'fill' resolution
 * @returns Width and height in pixels
 */
export function getChildSize(
  child: GameObjectWithLayout,
  parentSize?: { width: number; height: number },
  parentPadding?: { horizontal: number; vertical: number }
): LayoutSize {
  // For flex children, we still need to calculate their actual size
  // (especially for cross-axis dimension in row/column layouts)
  // The main-axis size will be overridden by flex distribution anyway

  // If __layoutProps exists, use it (has priority for explicit layout configuration)
  if (
    child.__layoutProps &&
    (child.__layoutProps.width !== undefined || child.__layoutProps.height !== undefined)
  ) {
    const layoutWidth = child.__layoutProps.width
    const layoutHeight = child.__layoutProps.height

    // Resolve width
    const parsedWidth = parseSize(layoutWidth)
    const width = resolveSize(
      parsedWidth,
      parentSize?.width,
      child.width ?? 100,
      parentPadding?.horizontal
    )

    // Resolve height
    const parsedHeight = parseSize(layoutHeight)
    const height = resolveSize(
      parsedHeight,
      parentSize?.height,
      child.height ?? 20,
      parentPadding?.vertical
    )

    return { width, height }
  }

  // Use dynamic size provider if available
  if (child.__getLayoutSize) {
    return child.__getLayoutSize()
  }

  // Fallback to current dimensions or default
  return {
    width: child.width ?? 100,
    height: child.height ?? 20,
  }
}

/**
 * Process a child container by recursively calculating its layout
 * @param child - Child game object to process
 * @param calculateLayoutFn - Layout calculation function (passed to avoid circular dependency)
 * @param parentSize - Optional parent dimensions for percentage resolution
 * @param parentPadding - Optional parent padding for 'fill' resolution
 */
export function processNestedContainer(
  child: GameObjectWithLayout,
  calculateLayoutFn: (
    container: Phaser.GameObjects.Container,
    props: LayoutProps,
    parentSize?: { width: number; height: number },
    parentPadding?: { horizontal: number; vertical: number }
  ) => void,
  parentSize?: { width: number; height: number },
  parentPadding?: { horizontal: number; vertical: number }
): void {
  if (!('list' in child) || !Array.isArray((child as Phaser.GameObjects.Container).list)) {
    return
  }

  const childContainer = child as Phaser.GameObjects.Container
  const childLayoutProps = child.__layoutProps ?? {}

  DebugLogger.log('layout', 'Child is a container, calculating nested layout first')

  calculateLayoutFn(childContainer, childLayoutProps, parentSize, parentPadding)
}

/**
 * Filter and prepare children for layout calculations
 * Skips background elements and processes nested containers
 * @param children - Raw children from container
 * @param calculateLayoutFn - Layout calculation function for nested containers
 * @returns Prepared layout children with size and margin data
 */
export function prepareLayoutChildren(
  children: GameObjectWithLayout[],
  calculateLayoutFn: (container: Phaser.GameObjects.Container, props: LayoutProps) => void
): LayoutChild[] {
  const layoutChildren: LayoutChild[] = []

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) {
      DebugLogger.log('layout', 'Skipping background')
      continue
    }

    // Process nested containers first
    processNestedContainer(child, calculateLayoutFn)

    const size = getChildSize(child)
    const margin = getMargin(child)

    layoutChildren.push({ child, size, margin })
  }

  return layoutChildren
}

/**
 * Extract margin values with defaults
 * @param margin - Edge insets
 * @returns Individual margin values
 */
export function extractMarginValues(margin: EdgeInsets) {
  return {
    top: margin.top ?? 0,
    right: margin.right ?? 0,
    bottom: margin.bottom ?? 0,
    left: margin.left ?? 0,
  }
}
