/**
 * Flex distribution utilities - handles flex-grow logic for layout children
 */
import type { LayoutChild } from '../types'

/**
 * Calculate flex distribution for children
 * Distributes remaining space among flex children proportionally
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
  const flexChildren: { child: LayoutChild; index: number; flexValue: number }[] = []
  let totalFlex = 0
  let nonFlexSpace = 0

  children.forEach((layoutChild, index) => {
    const flexValue = layoutChild.child.__layoutProps?.flex
    if (flexValue !== undefined && flexValue > 0) {
      flexChildren.push({ child: layoutChild, index, flexValue })
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
  const remainingSpace = Math.max(0, availableSpace - nonFlexSpace)

  // Distribute space proportionally
  const updatedChildren = [...children]

  for (const { child, index, flexValue } of flexChildren) {
    const flexShare = (remainingSpace * flexValue) / totalFlex

    if (direction === 'row') {
      updatedChildren[index] = {
        ...child,
        size: {
          ...child.size,
          width: flexShare,
        },
      }
    } else {
      // column
      updatedChildren[index] = {
        ...child,
        size: {
          ...child.size,
          height: flexShare,
        },
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
