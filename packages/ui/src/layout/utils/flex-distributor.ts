/**
 * Flex distribution utilities - handles flex-grow logic for layout children
 */
import type { LayoutChild } from '../types'

/**
 * Calculate flex distribution for children
 * Distributes remaining space among flex children proportionally
 * Respects min/max constraints during distribution
 * @param children - Layout children
 * @param availableSpace - Total available space on main axis
 * @param direction - Layout direction ('row' or 'column')
 * @returns Updated children with flex sizes resolved
 */
export function distributeFlexSpace(
  children: LayoutChild[],
  availableSpace: number,
  direction: 'row' | 'column' | 'stack'
): LayoutChild[] {
  if (direction === 'stack') {
    return children // Stack doesn't use flex
  }

  // Find all flex children and calculate total flex value
  const flexChildren: {
    child: LayoutChild
    index: number
    flexValue: number
    minSize?: number
    maxSize?: number
  }[] = []
  let totalFlex = 0
  let nonFlexSpace = 0

  children.forEach((layoutChild, index) => {
    const flexValue = layoutChild.child.__layoutProps?.flex
    if (flexValue !== undefined && flexValue > 0) {
      const props = layoutChild.child.__layoutProps
      const minSize = direction === 'row' ? props?.minWidth : props?.minHeight
      const maxSize = direction === 'row' ? props?.maxWidth : props?.maxHeight

      const flexChild: {
        child: LayoutChild
        index: number
        flexValue: number
        minSize?: number
        maxSize?: number
      } = { child: layoutChild, index, flexValue }

      if (minSize !== undefined) flexChild.minSize = minSize
      if (maxSize !== undefined) flexChild.maxSize = maxSize

      flexChildren.push(flexChild)
      totalFlex += flexValue
    } else {
      // Calculate space used by non-flex children (including margins)
      const margin = layoutChild.margin
      if (direction === 'row') {
        nonFlexSpace += layoutChild.size.width + (margin.left ?? 0) + (margin.right ?? 0)
      } else {
        nonFlexSpace += layoutChild.size.height + (margin.top ?? 0) + (margin.bottom ?? 0)
      }
    }
  })

  // No flex children - return as is
  if (flexChildren.length === 0 || totalFlex === 0) {
    return children
  }

  // Calculate remaining space for flex distribution
  let remainingSpace = Math.max(0, availableSpace - nonFlexSpace)

  // Distribute space proportionally with constraint handling
  const updatedChildren = [...children]
  const constrainedChildren = new Set<number>()

  // Multiple passes to handle constraints
  let hasChanges = true
  let iterations = 0
  const MAX_ITERATIONS = 10 // Prevent infinite loops

  while (hasChanges && iterations < MAX_ITERATIONS) {
    hasChanges = false
    iterations++

    // Calculate unconstrained flex total
    let unconstrainedFlex = 0
    for (const { index, flexValue } of flexChildren) {
      if (!constrainedChildren.has(index)) {
        unconstrainedFlex += flexValue
      }
    }

    if (unconstrainedFlex === 0) break

    // Distribute remaining space among unconstrained flex children
    for (const { child, index, flexValue, minSize, maxSize } of flexChildren) {
      if (constrainedChildren.has(index)) continue

      const flexShare = (remainingSpace * flexValue) / unconstrainedFlex
      let finalSize = flexShare

      // Apply constraints
      if (minSize !== undefined && finalSize < minSize) {
        finalSize = minSize
        constrainedChildren.add(index)
        remainingSpace -= finalSize
        hasChanges = true
      } else if (maxSize !== undefined && finalSize > maxSize) {
        finalSize = maxSize
        constrainedChildren.add(index)
        remainingSpace -= finalSize
        hasChanges = true
      }

      if (direction === 'row') {
        updatedChildren[index] = {
          ...child,
          size: {
            ...child.size,
            width: finalSize,
          },
        }
      } else {
        // column
        updatedChildren[index] = {
          ...child,
          size: {
            ...child.size,
            height: finalSize,
          },
        }
      }
    }
  }

  return updatedChildren
}

/**
 * Check if any children have flex property
 * @param children - Layout children
 * @returns True if at least one child has flex > 0
 */
export function hasFlexChildren(children: LayoutChild[]): boolean {
  return children.some((child) => {
    const flex = child.child.__layoutProps?.flex
    return flex !== undefined && flex > 0
  })
}
