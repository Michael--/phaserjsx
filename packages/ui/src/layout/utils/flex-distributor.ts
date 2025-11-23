/**
 * Flex distribution utilities - handles flexbox logic (grow, shrink, basis) for layout children
 */
import type { LayoutChild } from '../types'
import { parseSize, resolveSize } from './size-resolver'

/**
 * Flex item data structure
 */
interface FlexItem {
  child: LayoutChild
  index: number
  flexGrow: number
  flexShrink: number
  flexBasis: number
  minSize: number | undefined
  maxSize: number | undefined
  isFrozen: boolean
  targetSize: number
}

/**
 * Calculate flex distribution for children
 * Implements flexbox algorithm with grow, shrink, and basis support
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

  // Phase 1: Identify flex items and non-flex items
  const flexItems: FlexItem[] = []
  let nonFlexSpace = 0

  children.forEach((layoutChild, index) => {
    const props = layoutChild.child.__layoutProps
    const hasExplicitFlex = props?.flex !== undefined
    const hasExplicitShrink = props?.flexShrink !== undefined
    const hasExplicitBasis = props?.flexBasis !== undefined

    const flexGrow = props?.flex ?? 0
    // Only default flexShrink to 1 if element explicitly participates in flex
    const flexShrink =
      props?.flexShrink !== undefined
        ? props.flexShrink
        : hasExplicitFlex || hasExplicitBasis
          ? 1
          : 0
    const flexBasis = props?.flexBasis

    const margin = layoutChild.margin
    const marginSize =
      direction === 'row'
        ? (margin.left ?? 0) + (margin.right ?? 0)
        : (margin.top ?? 0) + (margin.bottom ?? 0)

    const minSize = direction === 'row' ? props?.minWidth : props?.minHeight
    const maxSize = direction === 'row' ? props?.maxWidth : props?.maxHeight

    // Calculate flex-basis
    let basisSize: number
    if (flexBasis !== undefined) {
      // Use explicit flex-basis
      const parsedBasis = parseSize(flexBasis)
      const currentSize = direction === 'row' ? layoutChild.size.width : layoutChild.size.height
      basisSize = resolveSize(parsedBasis, availableSpace, currentSize, undefined)
    } else {
      // Use width/height as flex-basis
      basisSize = direction === 'row' ? layoutChild.size.width : layoutChild.size.height
    }

    // Determine if this is a flex item
    // An item is a flex item if it explicitly sets flex, flexShrink, or flexBasis
    const isFlexItem = hasExplicitFlex || hasExplicitShrink || hasExplicitBasis

    if (isFlexItem) {
      flexItems.push({
        child: layoutChild,
        index,
        flexGrow,
        flexShrink,
        flexBasis: basisSize,
        minSize,
        maxSize,
        isFrozen: false,
        targetSize: basisSize,
      })

      nonFlexSpace += marginSize
    } else {
      // Non-flex item - uses its current size
      const size = direction === 'row' ? layoutChild.size.width : layoutChild.size.height
      nonFlexSpace += size + marginSize
    }
  })

  // No flex items - return as is
  if (flexItems.length === 0) {
    return children
  }

  // Phase 2: Calculate total flex-basis
  let totalFlexBasis = flexItems.reduce((sum, item) => sum + item.flexBasis, 0)
  let freeSpace = availableSpace - nonFlexSpace - totalFlexBasis

  // Phase 3: Flex distribution (grow or shrink)
  const updatedChildren = [...children]

  if (freeSpace > 0) {
    // GROW: Distribute positive free space
    distributeGrow(flexItems, freeSpace)
  } else if (freeSpace < 0) {
    // SHRINK: Distribute negative free space
    distributeShrink(flexItems, freeSpace)
  } else {
    // Exact fit - use flex-basis
    flexItems.forEach((item) => {
      item.targetSize = item.flexBasis
    })
  }

  // Phase 4: Apply calculated sizes
  flexItems.forEach((item) => {
    if (direction === 'row') {
      updatedChildren[item.index] = {
        ...item.child,
        size: {
          ...item.child.size,
          width: item.targetSize,
        },
      }
    } else {
      updatedChildren[item.index] = {
        ...item.child,
        size: {
          ...item.child.size,
          height: item.targetSize,
        },
      }
    }
  })

  return updatedChildren
}

/**
 * Distribute positive free space using flex-grow
 * @param flexItems - Flex items to distribute space among
 * @param freeSpace - Positive free space to distribute
 */
function distributeGrow(flexItems: FlexItem[], freeSpace: number): void {
  let remainingSpace = freeSpace
  const MAX_ITERATIONS = 10

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    // Calculate total flex-grow of unfrozen items
    const totalFlexGrow = flexItems
      .filter((item) => !item.isFrozen)
      .reduce((sum, item) => sum + item.flexGrow, 0)

    if (totalFlexGrow === 0 || remainingSpace <= 0) {
      break
    }

    let hasViolations = false

    // Distribute space proportionally
    for (const item of flexItems) {
      if (item.isFrozen) continue

      const growShare = (remainingSpace * item.flexGrow) / totalFlexGrow
      let targetSize = item.flexBasis + growShare

      // Apply min/max constraints
      if (item.minSize !== undefined && targetSize < item.minSize) {
        targetSize = item.minSize
        item.isFrozen = true
        hasViolations = true
      } else if (item.maxSize !== undefined && targetSize > item.maxSize) {
        targetSize = item.maxSize
        item.isFrozen = true
        hasViolations = true
      }

      item.targetSize = targetSize
    }

    if (!hasViolations) {
      break // All items distributed without violations
    }

    // Recalculate remaining space for next iteration
    remainingSpace = freeSpace
    for (const item of flexItems) {
      if (item.isFrozen) {
        remainingSpace -= item.targetSize - item.flexBasis
      }
    }
  }

  // Set targetSize for any remaining unfrozen items
  for (const item of flexItems) {
    if (!item.isFrozen) {
      // Already set in loop
    }
  }
}

/**
 * Distribute negative free space using flex-shrink
 * @param flexItems - Flex items to shrink
 * @param freeSpace - Negative free space (deficit)
 */
function distributeShrink(flexItems: FlexItem[], freeSpace: number): void {
  let remainingSpace = Math.abs(freeSpace)
  const MAX_ITERATIONS = 10

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    // Calculate scaled flex-shrink (shrink * basis)
    const totalScaledShrink = flexItems
      .filter((item) => !item.isFrozen)
      .reduce((sum, item) => sum + item.flexShrink * item.flexBasis, 0)

    if (totalScaledShrink === 0 || remainingSpace <= 0) {
      break
    }

    let hasViolations = false

    // Distribute shrinkage proportionally
    for (const item of flexItems) {
      if (item.isFrozen) continue

      const scaledShrink = item.flexShrink * item.flexBasis
      const shrinkShare = (remainingSpace * scaledShrink) / totalScaledShrink
      let targetSize = item.flexBasis - shrinkShare

      // Apply min/max constraints
      if (item.minSize !== undefined && targetSize < item.minSize) {
        targetSize = item.minSize
        item.isFrozen = true
        hasViolations = true
      } else if (item.maxSize !== undefined && targetSize > item.maxSize) {
        targetSize = item.maxSize
        item.isFrozen = true
        hasViolations = true
      }

      item.targetSize = targetSize
    }

    if (!hasViolations) {
      break // All items shrunk without violations
    }

    // Recalculate remaining space for next iteration
    remainingSpace = Math.abs(freeSpace)
    for (const item of flexItems) {
      if (item.isFrozen) {
        remainingSpace -= item.flexBasis - item.targetSize
      }
    }
  }

  // Set targetSize for any remaining unfrozen items
  for (const item of flexItems) {
    if (!item.isFrozen) {
      // Already set in loop
    }
  }
}

/**
 * Check if any children have flex properties (flex, flexShrink, or flexBasis)
 * @param children - Layout children
 * @returns True if at least one child participates in flexbox
 */
export function hasFlexChildren(children: LayoutChild[]): boolean {
  return children.some((child) => {
    const props = child.child.__layoutProps
    return (
      (props?.flex !== undefined && props.flex > 0) ||
      props?.flexShrink !== undefined ||
      props?.flexBasis !== undefined
    )
  })
}
