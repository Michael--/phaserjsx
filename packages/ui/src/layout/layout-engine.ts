/**
 * Layout engine - main orchestrator for layout calculations
 * Uses strategy pattern to handle different layout directions
 */
import Phaser from 'phaser'
import type { LayoutProps } from '../core-props'
import { DebugLogger, DevConfig } from '../dev-config'
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

/**
 * Callback function for deferred layout updates
 * Executed after all layouts are complete in next frame
 */
type DeferredUpdateCallback = () => void

/**
 * Central processor for deferred layout updates
 * Collects all updates that require final world coordinates or completed parent layouts
 * Executes them in batch via single requestAnimationFrame for optimal performance
 *
 * Use cases:
 * - Overflow mask positioning (needs world coordinates)
 * - Scroll position updates (needs final content size)
 * - Animation initialization (needs final positions)
 * - Custom effects requiring complete layout
 */
class DeferredLayoutQueue {
  private static callbacks: DeferredUpdateCallback[] = []
  private static scheduled = false

  /**
   * Schedule a callback to execute after current layout pass completes
   * All callbacks are batched and executed in single requestAnimationFrame
   * @param callback - Function to execute in next frame
   */
  static defer(callback: DeferredUpdateCallback): void {
    this.callbacks.push(callback)

    // Schedule flush if not already scheduled (only 1 requestAnimationFrame per frame)
    if (!this.scheduled) {
      this.scheduled = true
      requestAnimationFrame(() => this.flush())
    }
  }

  /**
   * Execute all pending callbacks in batch
   * Called once per frame via requestAnimationFrame
   */
  private static flush(): void {
    this.scheduled = false

    // Copy and clear callbacks before execution to prevent infinite loops
    const callbacks = [...this.callbacks]
    this.callbacks = []

    // Execute all callbacks with error isolation
    for (const callback of callbacks) {
      try {
        callback()
      } catch (error) {
        DebugLogger.error('DeferredLayoutQueue', 'Error in deferred callback:', error)
      }
    }
  }
}

/**
 * Entry for batched layout calculation
 */
interface LayoutBatchEntry {
  container: Phaser.GameObjects.Container
  containerProps: LayoutProps
  parentSize: { width: number; height: number } | undefined
  parentPadding: { horizontal: number; vertical: number } | undefined
}

/**
 * Batches layout calculations to reduce redundant recalculations
 * Prevents multiple calculations of same container within single synchronous call stack
 * Does NOT defer to next frame - executes immediately after current stack completes
 *
 * Benefits:
 * - Prevents multiple calculations of same container in one update
 * - Bottom-up execution order prevents redundant parent recalculations
 * - No visual flickering (executes in same frame)
 *
 * Usage:
 * - VDOM patches: LayoutBatchQueue.schedule() instead of direct calculateLayout()
 * - Appliers: LayoutBatchQueue.schedule() instead of direct calculateLayout()
 * - Tests: Set LayoutBatchQueue.synchronous = true for immediate execution
 */
export class LayoutBatchQueue {
  private static pending = new Map<Phaser.GameObjects.Container, LayoutBatchEntry>()
  private static scheduled = false

  /**
   * Enable synchronous mode for testing
   * When true, layouts execute immediately instead of batching
   */
  static synchronous = false

  /**
   * Schedule a layout calculation to execute after current call stack
   * Uses microtask (Promise) instead of requestAnimationFrame to avoid flickering
   * If container is already scheduled, updates entry with latest props
   * @param container - Container to calculate layout for
   * @param containerProps - Layout props
   * @param parentSize - Optional parent size for percentage resolution
   * @param parentPadding - Optional parent padding for fill resolution
   */
  static schedule(
    container: Phaser.GameObjects.Container,
    containerProps: LayoutProps,
    parentSize?: { width: number; height: number },
    parentPadding?: { horizontal: number; vertical: number }
  ): void {
    // Synchronous mode for tests - execute immediately
    if (this.synchronous) {
      calculateLayoutImmediate(container, containerProps, parentSize, parentPadding)
      return
    }

    // Update or add entry (latest props win if scheduled multiple times)
    this.pending.set(container, { container, containerProps, parentSize, parentPadding })

    // Schedule flush if not already scheduled
    // Use microtask (Promise.resolve) instead of requestAnimationFrame
    // This executes in SAME FRAME after current call stack, preventing flickering
    if (!this.scheduled) {
      this.scheduled = true
      Promise.resolve().then(() => this.flush())
    }
  }

  /**
   * Execute all pending layout calculations immediately
   * Processes in bottom-up order (deepest children first)
   * This prevents redundant parent recalculations
   */
  static flush(): void {
    this.scheduled = false

    if (this.pending.size === 0) return

    DebugLogger.time('performance', 'LayoutBatchQueue.flush')

    // Copy and clear pending entries
    const entries = Array.from(this.pending.values())
    this.pending.clear()

    // Sort bottom-up (deepest containers first)
    // This ensures children are laid out before parents
    entries.sort((a, b) => {
      const depthA = getContainerDepth(a.container)
      const depthB = getContainerDepth(b.container)
      return depthB - depthA // Higher depth = deeper = execute first
    })

    // Execute layout calculations in optimal order
    for (const entry of entries) {
      try {
        // Only calculate if container still exists and is active
        if (entry.container.active) {
          calculateLayoutImmediate(
            entry.container,
            entry.containerProps,
            entry.parentSize,
            entry.parentPadding
          )
        }
      } catch (error) {
        DebugLogger.error('LayoutBatchQueue', 'Error calculating layout:', error)
      }
    }

    DebugLogger.timeEnd('performance', 'LayoutBatchQueue.flush')
  }
}

/**
 * Get depth of container in scene hierarchy
 * Root containers have depth 0, children have depth 1, etc.
 * @param container - Container to get depth for
 * @returns Depth level (0 = root)
 */
function getContainerDepth(container: Phaser.GameObjects.Container): number {
  let depth = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: Phaser.GameObjects.Container | null = (container as any).parentContainer || null

  while (current) {
    depth++
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current = (current as any).parentContainer || null
  }

  return depth
}

/**
 * Updates mask position using world coordinates
 * Called during batch processing or immediate updates
 * @param container - Container with mask
 * @param width - Container width
 * @param height - Container height
 */
function updateMaskWorldPosition(
  container: Phaser.GameObjects.Container,
  width: number,
  height: number
): void {
  const extendedContainer = container as typeof container & {
    __overflowMask?: Phaser.GameObjects.Graphics | undefined
  }

  if (!extendedContainer.__overflowMask) return

  // Calculate absolute world position by traversing parent chain
  let worldX = 0
  let worldY = 0
  let current: Phaser.GameObjects.Container | null = container

  while (current) {
    worldX += current.x
    worldY += current.y
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current = (current as any).parentContainer || null
  }

  // Update mask geometry
  const maskGraphics = extendedContainer.__overflowMask
  maskGraphics.clear()

  // Use configurable color and alpha for debugging
  maskGraphics.fillStyle(DevConfig.visual.maskFillColor)
  maskGraphics.setAlpha(
    DevConfig.visual.showOverflowMasks ? Math.max(DevConfig.visual.maskAlpha, 0.01) : 0.0
  )

  // Expand by 1px on each side to prevent edge artifacts
  maskGraphics.fillRect(worldX - 1, worldY - 1, width + 2, height + 2)

  DebugLogger.log('overflowMask', 'Updated overflow mask world position:', {
    x: worldX,
    y: worldY,
    width,
    height,
  })
}

/**
 * Applies overflow mask to container if overflow='hidden' is set
 * Creates a geometry mask that clips children to container bounds
 *
 * IMPLEMENTATION NOTES:
 * - Mask Graphics is NOT added as child (must be independent for Phaser masks)
 * - Uses absolute world coordinates calculated from parent chain
 * - Defers position update to next frame for nested containers via DeferredLayoutQueue
 * - All deferred updates are batched in single requestAnimationFrame for optimal performance
 *
 * // Frame N - Initial Mount:
 * mount(scene, <View>...</View>)
 * ├─ calculateLayout(container)
 * │  ├─ Position children
 * │  ├─ Apply overflow mask
 * │  │  └─ DeferredLayoutQueue.defer(() => updateMask1())
 * │  └─ Nested calculateLayout(child)
 * │     └─ DeferredLayoutQueue.defer(() => updateMask2())
 * │
 * ├─ User code:
 * │  └─ DeferredLayoutQueue.defer(() => animateIn())
 * │
 * └─ requestAnimationFrame scheduled (only once!)
 *
 * // Frame N+1 - Deferred Execution:
 * requestAnimationFrame fires
 * └─ DeferredLayoutQueue.flush()
 *    ├─ updateMask1() ✓
 *    ├─ updateMask2() ✓
 *    └─ animateIn() ✓
 *
 * All done in one batch! 🚀
 *
 * @param container - Phaser container to apply mask to
 * @param containerProps - Layout props containing overflow setting
 * @param width - Container width
 * @param height - Container height
 */
function applyOverflowMask(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps,
  width: number,
  height: number
): void {
  const extendedContainer = container as typeof container & {
    __overflowMask?: Phaser.GameObjects.Graphics | undefined
  }

  if (containerProps.overflow === 'hidden') {
    // Create or update mask
    if (!extendedContainer.__overflowMask) {
      const maskGraphics = container.scene.add.graphics()
      extendedContainer.__overflowMask = maskGraphics

      // DO NOT add as child - mask needs to be independent for Phaser's mask system
      // Phaser containers with masks cannot have masked children (Phaser limitation)

      // Create geometry mask
      const mask = maskGraphics.createGeometryMask()
      container.setMask(mask)

      // Destroy mask when container is destroyed
      container.once('destroy', () => {
        if (extendedContainer.__overflowMask) {
          extendedContainer.__overflowMask.destroy()
          extendedContainer.__overflowMask = undefined
        }
      })

      DebugLogger.log('overflowMask', 'Created overflow mask')
    }

    // Check if this is a nested container (has parent container)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasParentContainer = (container as any).parentContainer != null

    if (hasParentContainer) {
      // Nested container: Defer mask position update to next frame
      // This ensures parent containers are fully positioned before calculating world coords
      // Uses deferred queue for optimal performance with many containers
      DeferredLayoutQueue.defer(() => {
        // Verify container still exists and has overflow=hidden
        if (container.active && containerProps.overflow === 'hidden') {
          updateMaskWorldPosition(container, width, height)
        }
      })

      DebugLogger.log('overflowMask', 'Scheduled deferred mask update for nested container')
    } else {
      // Root container: Update mask immediately (parent positions are already final)
      updateMaskWorldPosition(container, width, height)
    }
  } else if (extendedContainer.__overflowMask) {
    // Remove mask if overflow is not hidden
    container.clearMask()
    extendedContainer.__overflowMask.destroy()
    extendedContainer.__overflowMask = undefined

    DebugLogger.log('overflowMask', 'Removed overflow mask')
  }
}

/**
 * Strategy map - reusable strategy instances
 */
const strategies: Record<string, LayoutStrategy> = {
  column: new ColumnLayoutStrategy(),
  row: new RowLayoutStrategy(),
  stack: new StackLayoutStrategy(),
}

/**
 * Calculate layout for a container and its children immediately (internal)
 * DO NOT CALL DIRECTLY - Use calculateLayout() which batches for performance
 * @param container - Phaser container with children
 * @param containerProps - Layout props of the container
 * @param parentSize - Optional parent dimensions for percentage resolution
 * @param parentPadding - Optional parent padding for 'fill' resolution
 */
function calculateLayoutImmediate(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps,
  parentSize?: { width: number; height: number },
  parentPadding?: { horizontal: number; vertical: number }
): void {
  const children = container.list as GameObjectWithLayout[]

  // Debug: Track excessive layout calls
  // console.log('[LAYOUT] calculateLayout called for container with', children?.length ?? 0, 'children')

  DebugLogger.group('layout', `Container with ${children?.length ?? 0} children`)

  if (!children || !Array.isArray(children)) {
    DebugLogger.groupEnd('layout')
    return
  }

  // Performance timing
  DebugLogger.time('performance', 'calculateLayout')

  // 1. Extract layout parameters
  const direction = containerProps.direction ?? 'column'
  const padding = normalizePadding(containerProps.padding)
  const gap = containerProps.gap ?? 0
  const justifyContent = containerProps.justifyContent ?? 'start'

  DebugLogger.log('layout', `Direction: ${direction}, Padding:`, padding)

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

  // Calculate available content size (container minus padding) for child size resolution
  // This allows 'fill' and percentage sizes to resolve correctly relative to content area
  const availableContentSize = currentContainerSize
    ? {
        width: currentContainerSize.width - padding.left - padding.right,
        height: currentContainerSize.height - padding.top - padding.bottom,
      }
    : undefined

  DebugLogger.log('layout', 'Pre-calculated container size:', currentContainerSize)
  DebugLogger.log('layout', 'Available content size (for fill):', availableContentSize)

  // 2. Prepare layout children (filter backgrounds, process nested containers)
  const layoutChildren: LayoutChild[] = []

  for (const child of children) {
    // Skip background rectangles
    if (child.__isBackground) {
      DebugLogger.log('layout', 'Skipping background')
      continue
    } // Skip processing nested containers with flex (they need parent size first)
    const hasFlex = (child.__layoutProps?.flex ?? 0) > 0
    if (!hasFlex) {
      // Process nested containers (pass current container size and padding for resolution)
      const currentPaddingForChild = currentContainerSize
        ? { horizontal: padding.left + padding.right, vertical: padding.top + padding.bottom }
        : undefined
      processNestedContainer(
        child,
        calculateLayout,
        currentContainerSize ?? parentSize,
        currentPaddingForChild ?? parentPadding
      )
    }

    // Get child size - pass total container size and padding so both % and fill work correctly
    // Percentages resolve relative to total size, fill resolves relative to content-area
    const parentPaddingForChild = {
      horizontal: padding.left + padding.right,
      vertical: padding.top + padding.bottom,
    }
    const size = getChildSize(child, currentContainerSize ?? parentSize, parentPaddingForChild)
    const margin = getMargin(child)

    layoutChildren.push({ child, size, margin })
  }

  // 3. Select strategy based on direction
  const strategy = strategies[direction]
  if (!strategy) {
    DebugLogger.error('Layout', `Unknown direction: ${direction}`)
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

  // 6. Calculate container dimensions (with parent size and padding for resolution)
  const { width: containerWidth, height: containerHeight } = calculateContainerSize(
    containerProps,
    metrics,
    padding,
    direction,
    gap,
    layoutChildren.length,
    parentSize,
    parentPadding
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

    // Process nested flex containers now that they have their size
    for (const layoutChild of finalLayoutChildren) {
      const hasFlex = (layoutChild.child.__layoutProps?.flex ?? 0) > 0
      if (hasFlex) {
        // Temporarily set explicit size based on flex calculation
        const originalProps = { ...layoutChild.child.__layoutProps }
        if (direction === 'row') {
          layoutChild.child.__layoutProps = {
            ...layoutChild.child.__layoutProps,
            width: layoutChild.size.width,
          }
        } else {
          layoutChild.child.__layoutProps = {
            ...layoutChild.child.__layoutProps,
            height: layoutChild.size.height,
          }
        }

        processNestedContainer(
          layoutChild.child,
          calculateLayout,
          {
            width: containerWidth,
            height: containerHeight,
          },
          {
            horizontal: padding.left + padding.right,
            vertical: padding.top + padding.bottom,
          }
        )

        // Restore original props
        layoutChild.child.__layoutProps = originalProps
      }
    }

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
  applyChildPositions(finalLayoutChildren, positions)

  // 12. Apply container dimensions
  applyContainerDimensions(container, containerWidth, containerHeight)

  // 13. Update background and hit area
  updateBackground(container, containerWidth, containerHeight)
  updateHitArea(container, containerWidth, containerHeight)

  // 14. Apply overflow mask if needed
  applyOverflowMask(container, containerProps, containerWidth, containerHeight)

  // End performance timing
  DebugLogger.timeEnd('performance', 'calculateLayout')
  DebugLogger.groupEnd('layout')
}

/**
 * Calculate layout for a container and its children
 * Batches layout calculations for optimal performance
 * Multiple calls within same frame are deduplicated and executed bottom-up
 * @param container - Phaser container with children
 * @param containerProps - Layout props of the container
 * @param parentSize - Optional parent dimensions for percentage resolution
 * @param parentPadding - Optional parent padding for 'fill' resolution
 */
export function calculateLayout(
  container: Phaser.GameObjects.Container,
  containerProps: LayoutProps,
  parentSize?: { width: number; height: number },
  parentPadding?: { horizontal: number; vertical: number }
): void {
  LayoutBatchQueue.schedule(container, containerProps, parentSize, parentPadding)
}
