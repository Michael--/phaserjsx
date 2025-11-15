/**
 * Utility functions for working with layout children
 */
import type Phaser from 'phaser'
import type { EdgeInsets, LayoutProps } from '../../core-props'
import type { GameObjectWithLayout, LayoutChild, LayoutSize } from '../types'

const debug = false

/**
 * Get effective margin for a child
 * @param child - Child game object
 * @returns Edge insets
 */
export function getMargin(child: GameObjectWithLayout): EdgeInsets {
  return child.__layoutProps?.margin ?? {}
}

/**
 * Get effective size of a child
 * Calls __getLayoutSize if available, otherwise falls back to layoutProps or default
 * @param child - Child game object
 * @returns Width and height
 */
export function getChildSize(child: GameObjectWithLayout): LayoutSize {
  // Use dynamic size provider if available
  if (child.__getLayoutSize) {
    return child.__getLayoutSize()
  }

  // Fallback to layout props or dimensions
  const layoutWidth = child.__layoutProps?.width
  const layoutHeight = child.__layoutProps?.height

  return {
    width: layoutWidth ?? child.width ?? 100,
    height: layoutHeight ?? child.height ?? 20,
  }
}

/**
 * Process a child container by recursively calculating its layout
 * @param child - Child game object to process
 * @param calculateLayoutFn - Layout calculation function (passed to avoid circular dependency)
 */
export function processNestedContainer(
  child: GameObjectWithLayout,
  calculateLayoutFn: (container: Phaser.GameObjects.Container, props: LayoutProps) => void
): void {
  if (!('list' in child) || !Array.isArray((child as Phaser.GameObjects.Container).list)) {
    return
  }

  const childContainer = child as Phaser.GameObjects.Container
  const childLayoutProps = child.__layoutProps ?? {}

  if (debug) console.log('  -> Child is a container, calculating nested layout first')

  calculateLayoutFn(childContainer, childLayoutProps)
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
      if (debug) console.log('  Skipping background')
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
