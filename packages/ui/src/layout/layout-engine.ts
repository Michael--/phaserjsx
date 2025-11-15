/**
 * Layout engine - main orchestrator for layout calculations
 * Uses strategy pattern to handle different layout directions
 */
import type Phaser from 'phaser'
import type { LayoutProps } from '../core-props'
import { updateBackground, updateHitArea } from './appliers/background-applier'
import { applyContainerDimensions } from './appliers/container-applier'
import { applyChildPositions } from './appliers/position-applier'
import type { LayoutStrategy } from './strategies/base-strategy'
import { ColumnLayoutStrategy } from './strategies/column-layout'
import { RowLayoutStrategy } from './strategies/row-layout'
import { StackLayoutStrategy } from './strategies/stack-layout'
import type { GameObjectWithLayout, LayoutChild, LayoutContext, Position } from './types'
import { getChildSize, getMargin, processNestedContainer } from './utils/child-utils'
import { calculateContainerSize, normalizePadding } from './utils/dimension-calculator'
import { distributeFlexSpace, hasFlexChildren } from './utils/flex-distributor'
import { calculateJustifyContent } from './utils/spacing-calculator'

const debug = false

/**
 * Strategy map - reusable strategy instances
 */
const strategies: Record<string, LayoutStrategy> = {
  column: new ColumnLayoutStrategy(),
  row: new RowLayoutStrategy(),
  stack: new StackLayoutStrategy(),
}

/**
 * Calculate layout for a container and its children
 * Main entry point for layout system
 * @param container - Phaser container with children
 * @param containerProps - Layout props of the container
 * @param parentSize - Optional parent dimensions for percentage resolution
 */
export function calculateLayout(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps,
  parentSize?: { width: number; height: number }
): void {
  const children = container.list as GameObjectWithLayout[]

  if (debug) {
    console.log(
      '[Layout] Container with',
      children?.length ?? 0,
      'children, props:',
      containerProps
    )
  }

  if (!children || !Array.isArray(children)) return

  // 1. Extract layout parameters
  const direction = containerProps.direction ?? 'column'
  const padding = normalizePadding(containerProps.padding)
  const gap = containerProps.gap ?? 0
  const justifyContent = containerProps.justifyContent ?? 'start'

  if (debug) console.log('  Direction:', direction, 'Padding:', padding)

  // 2a. Pre-calculate container size if explicitly set (needed for percentage children)
  //     This allows percentage-based child sizes to resolve correctly
  const explicitContainerWidth =
    typeof containerProps.width === 'number' ? containerProps.width : undefined
  const explicitContainerHeight =
    typeof containerProps.height === 'number' ? containerProps.height : undefined

  const currentContainerSize =
    explicitContainerWidth !== undefined || explicitContainerHeight !== undefined
      ? {
          width: explicitContainerWidth ?? container.width,
          height: explicitContainerHeight ?? container.height,
        }
      : undefined

  if (debug && currentContainerSize) {
    console.log('  Pre-calculated container size for percentage resolution:', currentContainerSize)
  }

  // 2. Prepare layout children (filter backgrounds, process nested containers)
  const layoutChildren: LayoutChild[] = []

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) {
      if (debug) console.log('  Skipping background')
      continue
    }

    // Process nested containers (pass current container size for percentage resolution)
    processNestedContainer(child, calculateLayout, currentContainerSize ?? parentSize)

    const size = getChildSize(child, currentContainerSize ?? parentSize)
    const margin = getMargin(child)

    layoutChildren.push({ child, size, margin })
  }

  // 3. Select strategy based on direction
  const strategy = strategies[direction]
  if (!strategy) {
    console.error(`[Layout] Unknown direction: ${direction}`)
    return
  }

  // 4. Build layout context (will be used after we know container dimensions)
  const contextPartial = {
    containerProps,
    padding,
    gap,
    children: layoutChildren,
  }

  // 5. Calculate metrics using strategy
  const metrics = strategy.calculateMetrics(layoutChildren, contextPartial as LayoutContext)

  // 6. Calculate container dimensions (with parent size for percentage resolution)
  const { width: containerWidth, height: containerHeight } = calculateContainerSize(
    containerProps,
    metrics,
    padding,
    direction,
    gap,
    layoutChildren.length,
    parentSize
  )

  // 6a. Distribute flex space if there are flex children
  let finalLayoutChildren = layoutChildren
  if (hasFlexChildren(layoutChildren)) {
    const contentSize =
      direction === 'row'
        ? containerWidth - padding.left - padding.right
        : containerHeight - padding.top - padding.bottom

    // Subtract gap space (gap appears between children, so n-1 gaps for n children)
    const totalGapSpace = layoutChildren.length > 1 ? gap * (layoutChildren.length - 1) : 0
    const availableMainSpace = contentSize - totalGapSpace

    finalLayoutChildren = distributeFlexSpace(layoutChildren, availableMainSpace, direction)

    // Recalculate metrics with updated sizes
    const updatedMetrics = strategy.calculateMetrics(
      finalLayoutChildren,
      contextPartial as LayoutContext
    )
    metrics.totalMainSize = updatedMetrics.totalMainSize
    if (direction === 'column') {
      metrics.maxWidth = updatedMetrics.maxWidth
    } else if (direction === 'row') {
      metrics.maxHeight = updatedMetrics.maxHeight
    }
  }

  // 7. Calculate content area
  const contentArea = {
    width: containerWidth - padding.left - padding.right,
    height: containerHeight - padding.top - padding.bottom,
  }

  // 8. Complete layout context
  const context: LayoutContext = {
    ...contextPartial,
    children: finalLayoutChildren,
    contentArea,
    parentSize: {
      width: containerWidth,
      height: containerHeight,
    },
  }

  // 9. Calculate spacing for justifyContent
  const availableMainSpace = direction === 'row' ? contentArea.width : contentArea.height
  const remainingSpace = availableMainSpace - metrics.totalMainSize

  let mainStart = 0
  let spaceBetween = 0

  // For stack direction, justifyContent is not applicable
  if (direction !== 'stack') {
    const justifyResult = calculateJustifyContent(
      justifyContent,
      remainingSpace,
      finalLayoutChildren.length
    )
    mainStart = justifyResult.mainStart
    spaceBetween = justifyResult.spaceBetween
  }

  // 10. Position all children using strategy
  const positions: Position[] = []
  let currentMain = mainStart

  for (let i = 0; i < finalLayoutChildren.length; i++) {
    const child = finalLayoutChildren[i]
    if (!child) continue

    const result = strategy.positionChild(child, i, context, currentMain)

    positions.push(result.position)
    currentMain = result.nextMain

    // Add gap and space-between spacing (not for stack)
    if (direction !== 'stack' && i < finalLayoutChildren.length - 1) {
      currentMain += gap + spaceBetween
    }
  }

  // 11. Apply positions to children
  applyChildPositions(finalLayoutChildren, positions, debug)

  // 12. Apply container dimensions
  applyContainerDimensions(container, containerWidth, containerHeight, debug)

  // 13. Update background and hit area
  updateBackground(container, containerWidth, containerHeight, debug)
  updateHitArea(container, containerWidth, containerHeight, debug)
}
