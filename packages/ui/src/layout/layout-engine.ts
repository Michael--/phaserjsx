/**
 * Layout engine - main orchestrator for layout calculations
 * Uses strategy pattern to handle different layout directions
 */
import * as Phaser from 'phaser'
import type { LayoutProps } from '../core-props'
import { normalizeGap } from '../core-props'
import { DebugLogger, DevConfig } from '../dev-config'
import { updateBackground, updateHitArea } from './appliers/background-applier'
import { applyContainerDimensions } from './appliers/container-applier'
import { applyChildPositions } from './appliers/position-applier'
import type { LayoutStrategy } from './strategies/base-strategy'
import { ColumnLayoutStrategy } from './strategies/column-layout'
import { RowLayoutStrategy } from './strategies/row-layout'
import { StackLayoutStrategy } from './strategies/stack-layout'
import type {
  GameObjectWithLayout,
  LayoutChild,
  LayoutContext,
  LayoutLine,
  Position,
} from './types'
import { getChildSize, getMargin, isLayoutChild, processNestedContainer } from './utils/child-utils'
import { calculateContainerSize, normalizePadding } from './utils/dimension-calculator'
import { distributeFlexSpace, hasFlexChildren } from './utils/flex-distributor'
import { clampSize, parseSize, resolveSize } from './utils/size-resolver'
import { calculateAlignItems, calculateJustifyContent } from './utils/spacing-calculator'

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
 * - Gesture hit area updates (needs final layout size)
 */
export class DeferredLayoutQueue {
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

type OverflowMaskCornerRadius = number | { tl?: number; tr?: number; bl?: number; br?: number }

type OverflowMaskState = {
  debugId: number
  width: number
  height: number
  cornerRadius: OverflowMaskCornerRadius | undefined
  updateListener: () => void
  lastTx: number
  lastTy: number
  lastRotation: number
  lastScaleX: number
  lastScaleY: number
  lastWidth: number
  lastHeight: number
  lastCornerRadiusKey: string
  lastShowMaskOverlay: boolean
  lastMaskFillColor: number
  lastMaskAlpha: number
  lastIsWebGL: boolean
}

const MASK_CHANGE_EPSILON = 0.01
const MASK_SUSPICIOUS_AREA = 1_000_000
const MASK_SUSPICIOUS_DIMENSION = 4096
const MASK_SUSPICIOUS_SCALE = 8
let nextMaskDebugId = 1

type MaskDebugEntry = {
  id: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  rotation: number
  estimatedPixelArea: number
  cornerRadiusKey: string
}

const activeMaskDebug = new Map<number, MaskDebugEntry>()
const maskStats = {
  created: 0,
  destroyed: 0,
  active: 0,
}

function publishMaskStats(): void {
  if (typeof window === 'undefined') return
  const masks = Array.from(activeMaskDebug.values())
  const suspicious = masks.filter(
    (entry) =>
      !Number.isFinite(entry.width) ||
      !Number.isFinite(entry.height) ||
      entry.width <= 0 ||
      entry.height <= 0 ||
      entry.width > MASK_SUSPICIOUS_DIMENSION ||
      entry.height > MASK_SUSPICIOUS_DIMENSION ||
      Math.abs(entry.scaleX) > MASK_SUSPICIOUS_SCALE ||
      Math.abs(entry.scaleY) > MASK_SUSPICIOUS_SCALE ||
      entry.estimatedPixelArea > MASK_SUSPICIOUS_AREA
  )
  ;(
    window as unknown as {
      __phaserjsxMaskStats?: typeof maskStats & {
        masks: MaskDebugEntry[]
        suspicious: MaskDebugEntry[]
      }
    }
  ).__phaserjsxMaskStats = {
    ...maskStats,
    masks,
    suspicious,
  }
}

function isNearlyEqual(a: number, b: number, epsilon = MASK_CHANGE_EPSILON): boolean {
  return Math.abs(a - b) <= epsilon
}

function getCornerRadiusCacheKey(cornerRadius: OverflowMaskCornerRadius | undefined): string {
  if (cornerRadius === undefined || cornerRadius === 0) return 'none'
  if (typeof cornerRadius === 'number') return `n:${cornerRadius}`
  return `o:${cornerRadius.tl ?? 0},${cornerRadius.tr ?? 0},${cornerRadius.bl ?? 0},${cornerRadius.br ?? 0}`
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
    __overflowMaskState?: OverflowMaskState | undefined
  }

  if (!extendedContainer.__overflowMask || !extendedContainer.__overflowMaskState) return

  extendedContainer.__overflowMaskState.width = width
  extendedContainer.__overflowMaskState.height = height
  extendedContainer.__overflowMaskState.cornerRadius = (
    extendedContainer.__overflowMask as Phaser.GameObjects.Graphics & {
      __cornerRadius?: OverflowMaskCornerRadius
    }
  ).__cornerRadius
  extendedContainer.__overflowMaskState.updateListener()
}

/**
 * Applies overflow mask to container if overflow='hidden' is set
 * Creates a geometry mask that clips children to container bounds
 *
 * IMPLEMENTATION NOTES:
 * - Mask Graphics is NOT added as child (must be independent for Phaser masks)
 * - Uses cached world-transform sampling with per-frame change detection
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
  containerProps: LayoutProps & {
    cornerRadius?: number | { tl?: number; tr?: number; bl?: number; br?: number }
  },
  width: number,
  height: number
): void {
  const extendedContainer = container as typeof container & {
    __overflowMask?:
      | (Phaser.GameObjects.Graphics & {
          __cornerRadius?: number | { tl?: number; tr?: number; bl?: number; br?: number }
        })
      | undefined
    __overflowMaskFilter?: Phaser.Filters.Mask | undefined
    __overflowMaskBackend?: 'filter' | 'geometry' | undefined
    __overflowMaskState?: OverflowMaskState | undefined
    __overflowMaskUpdateListener?: (() => void) | undefined
  }

  if (containerProps.overflow === 'hidden') {
    // Create or update mask
    if (!extendedContainer.__overflowMask) {
      const maskGraphics = container.scene.add.graphics() as Phaser.GameObjects.Graphics & {
        __cornerRadius?: number | { tl?: number; tr?: number; bl?: number; br?: number }
      }
      extendedContainer.__overflowMask = maskGraphics
      maskStats.created += 1
      maskStats.active += 1
      publishMaskStats()

      // Store cornerRadius for use in updateMaskWorldPosition
      if (containerProps.cornerRadius !== undefined) {
        maskGraphics.__cornerRadius = containerProps.cornerRadius
      }

      const maskState: OverflowMaskState = {
        debugId: nextMaskDebugId++,
        width,
        height,
        cornerRadius: containerProps.cornerRadius,
        updateListener: () => {},
        lastTx: Number.NaN,
        lastTy: Number.NaN,
        lastRotation: Number.NaN,
        lastScaleX: Number.NaN,
        lastScaleY: Number.NaN,
        lastWidth: Number.NaN,
        lastHeight: Number.NaN,
        lastCornerRadiusKey: '',
        lastShowMaskOverlay: false,
        lastMaskFillColor: Number.NaN,
        lastMaskAlpha: Number.NaN,
        lastIsWebGL: false,
      }

      const updateMask = () => {
        if (!container.active || !maskGraphics.active) return

        const worldMatrix = container.getWorldTransformMatrix()
        const worldX = worldMatrix.tx
        const worldY = worldMatrix.ty
        const worldRotation = worldMatrix.rotationNormalized
        const worldScaleX = worldMatrix.scaleX
        const worldScaleY = worldMatrix.scaleY

        const showMaskOverlay = DevConfig.visual.showOverflowMasks
        const isWebGL = container.scene.sys.renderer.type === Phaser.WEBGL
        const maskAlpha = isWebGL
          ? 1.0
          : showMaskOverlay
            ? Math.max(DevConfig.visual.maskAlpha, 0.01)
            : 0.0
        const maskFillColor = DevConfig.visual.maskFillColor
        const cornerRadiusKey = getCornerRadiusCacheKey(maskState.cornerRadius)

        const transformChanged =
          !isNearlyEqual(maskState.lastTx, worldX) ||
          !isNearlyEqual(maskState.lastTy, worldY) ||
          !isNearlyEqual(maskState.lastRotation, worldRotation) ||
          !isNearlyEqual(maskState.lastScaleX, worldScaleX) ||
          !isNearlyEqual(maskState.lastScaleY, worldScaleY)
        const styleChanged =
          maskState.lastShowMaskOverlay !== showMaskOverlay ||
          maskState.lastMaskFillColor !== maskFillColor ||
          !isNearlyEqual(maskState.lastMaskAlpha, maskAlpha) ||
          maskState.lastIsWebGL !== isWebGL
        const geometryChanged =
          !isNearlyEqual(maskState.lastWidth, maskState.width) ||
          !isNearlyEqual(maskState.lastHeight, maskState.height) ||
          maskState.lastCornerRadiusKey !== cornerRadiusKey

        if (!transformChanged && !styleChanged && !geometryChanged) {
          return
        }

        if (transformChanged) {
          maskGraphics.setPosition(worldX, worldY)
          maskGraphics.setRotation(worldRotation)
          maskGraphics.setScale(worldScaleX, worldScaleY)
        }

        if (styleChanged) {
          maskGraphics.setVisible(showMaskOverlay)
          maskGraphics.fillStyle(maskFillColor)
          maskGraphics.setAlpha(maskAlpha)
        }

        if (geometryChanged) {
          maskGraphics.clear()

          // Draw rectangle in local space (transforms applied via graphics transform)
          // Expand by 1px on each side to prevent edge artifacts.
          const expandedWidth = maskState.width + 2
          const expandedHeight = maskState.height + 2
          if (expandedWidth > 0 && expandedHeight > 0) {
            const cornerRadius = maskState.cornerRadius
            if (cornerRadius !== undefined && cornerRadius !== 0) {
              maskGraphics.fillRoundedRect(-1, -1, expandedWidth, expandedHeight, cornerRadius)
            } else {
              maskGraphics.fillRect(-1, -1, expandedWidth, expandedHeight)
            }
          }

          maskState.lastWidth = maskState.width
          maskState.lastHeight = maskState.height
          maskState.lastCornerRadiusKey = cornerRadiusKey
        }

        maskState.lastTx = worldX
        maskState.lastTy = worldY
        maskState.lastRotation = worldRotation
        maskState.lastScaleX = worldScaleX
        maskState.lastScaleY = worldScaleY
        maskState.lastShowMaskOverlay = showMaskOverlay
        maskState.lastMaskFillColor = maskFillColor
        maskState.lastMaskAlpha = maskAlpha
        maskState.lastIsWebGL = isWebGL

        const expandedWidth = Math.max(0, maskState.width + 2)
        const expandedHeight = Math.max(0, maskState.height + 2)
        activeMaskDebug.set(maskState.debugId, {
          id: maskState.debugId,
          width: maskState.width,
          height: maskState.height,
          scaleX: worldScaleX,
          scaleY: worldScaleY,
          rotation: worldRotation,
          estimatedPixelArea: expandedWidth * expandedHeight * Math.abs(worldScaleX * worldScaleY),
          cornerRadiusKey,
        })
        publishMaskStats()
      }

      maskState.updateListener = updateMask
      extendedContainer.__overflowMaskState = maskState
      extendedContainer.__overflowMaskUpdateListener = updateMask

      // DO NOT add as child - mask needs to be independent for Phaser's mask system
      // Phaser containers with masks cannot have masked children (Phaser limitation)

      // WebGL path uses EXTERNAL filter-mask.
      // If external filters are unavailable, fallback to GeometryMask.
      const isWebGL = container.scene.sys.renderer.type === Phaser.WEBGL
      const useFilterMask = isWebGL
      if (useFilterMask) {
        container.enableFilters()
        const filters = container.filters
        if (filters?.external) {
          extendedContainer.__overflowMaskFilter = filters.external.addMask(maskGraphics)
          extendedContainer.__overflowMaskBackend = 'filter'
        } else {
          // Fallback if external filters are unexpectedly unavailable.
          const mask = maskGraphics.createGeometryMask()
          container.setMask(mask)
          extendedContainer.__overflowMaskBackend = 'geometry'
        }
      } else {
        const mask = maskGraphics.createGeometryMask()
        container.setMask(mask)
        extendedContainer.__overflowMaskBackend = 'geometry'
      }

      // Listen once and let the cached update function bail out if no changes occurred.
      container.scene.events.on('postupdate', updateMask)

      // Destroy mask when container is destroyed
      container.once('destroy', () => {
        const extendedContainer = container as typeof container & {
          __overflowMask?: Phaser.GameObjects.Graphics | undefined
          __overflowMaskUpdateListener?: (() => void) | undefined
          __overflowMaskFilter?: Phaser.Filters.Mask | undefined
          __overflowMaskBackend?: 'filter' | 'geometry' | undefined
          __overflowMaskState?: OverflowMaskState | undefined
        }

        // Remove postupdate listener from scene
        if (extendedContainer.__overflowMaskUpdateListener) {
          container.scene.events.off('postupdate', extendedContainer.__overflowMaskUpdateListener)
        }

        if (extendedContainer.__overflowMask) {
          if (extendedContainer.__overflowMaskState) {
            activeMaskDebug.delete(extendedContainer.__overflowMaskState.debugId)
          }
          extendedContainer.__overflowMask.destroy()
          extendedContainer.__overflowMask = undefined
          maskStats.destroyed += 1
          maskStats.active = Math.max(0, maskStats.active - 1)
          publishMaskStats()
        }
        if (
          extendedContainer.__overflowMaskBackend === 'filter' &&
          extendedContainer.__overflowMaskFilter
        ) {
          container.filters?.external?.remove(extendedContainer.__overflowMaskFilter, true)
          extendedContainer.__overflowMaskFilter = undefined
        }
        if (extendedContainer.__overflowMaskBackend === 'geometry') {
          container.clearMask()
        }
        extendedContainer.__overflowMaskBackend = undefined
        extendedContainer.__overflowMaskUpdateListener = undefined
        extendedContainer.__overflowMaskState = undefined
      })

      DebugLogger.log('overflowMask', 'Created overflow mask')
    }

    if (extendedContainer.__overflowMask) {
      if (containerProps.cornerRadius === undefined) {
        delete extendedContainer.__overflowMask.__cornerRadius
      } else {
        extendedContainer.__overflowMask.__cornerRadius = containerProps.cornerRadius
      }
    }
    if (extendedContainer.__overflowMaskState) {
      extendedContainer.__overflowMaskState.cornerRadius = containerProps.cornerRadius
      extendedContainer.__overflowMaskState.width = width
      extendedContainer.__overflowMaskState.height = height
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
    if (
      extendedContainer.__overflowMaskBackend === 'filter' &&
      extendedContainer.__overflowMaskFilter
    ) {
      container.filters?.external?.remove(extendedContainer.__overflowMaskFilter, true)
      extendedContainer.__overflowMaskFilter = undefined
    } else {
      container.clearMask()
    }
    extendedContainer.__overflowMask.destroy()
    if (extendedContainer.__overflowMaskState) {
      activeMaskDebug.delete(extendedContainer.__overflowMaskState.debugId)
    }
    extendedContainer.__overflowMask = undefined
    extendedContainer.__overflowMaskState = undefined
    maskStats.destroyed += 1
    maskStats.active = Math.max(0, maskStats.active - 1)
    publishMaskStats()
    extendedContainer.__overflowMaskBackend = undefined

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
 * Invalidates parent layout if container size changed after recalculation
 * Propagates layout changes up the hierarchy to ensure parent containers adapt
 * @param container - Container that was just laid out
 * @param oldSize - Size before layout calculation
 * @param newWidth - New width after layout
 * @param newHeight - New height after layout
 */
type LayoutSize = { width: number; height: number }
type LayoutCycleState = {
  last: LayoutSize
  prev?: LayoutSize
  count: number
  lastTime: number
}

const LAYOUT_CYCLE_EPSILON = 0.5
const LAYOUT_CYCLE_TIME_MS = 20
const LAYOUT_CYCLE_MAX = 5
const LAYOUT_MAX_SIZE = 200000
const layoutCycleGuard = new WeakMap<Phaser.GameObjects.Container, LayoutCycleState>()

function isCloseSize(a: LayoutSize, b: LayoutSize, epsilon: number): boolean {
  return Math.abs(a.width - b.width) < epsilon && Math.abs(a.height - b.height) < epsilon
}

function invalidateParentLayoutIfNeeded(
  container: Phaser.GameObjects.Container,
  oldSize: { width: number; height: number } | undefined,
  newWidth: number,
  newHeight: number
): void {
  // Skip if no old size (first layout) or size unchanged
  if (
    !oldSize ||
    (Math.abs(oldSize.width - newWidth) < LAYOUT_CYCLE_EPSILON &&
      Math.abs(oldSize.height - newHeight) < LAYOUT_CYCLE_EPSILON)
  ) {
    return
  }

  if (
    !Number.isFinite(newWidth) ||
    !Number.isFinite(newHeight) ||
    newWidth > LAYOUT_MAX_SIZE ||
    newHeight > LAYOUT_MAX_SIZE
  ) {
    const containerWithProps = container as Phaser.GameObjects.Container & {
      __layoutProps?: LayoutProps
      list?: unknown[]
    }
    DebugLogger.warn('layout', 'Runaway layout size detected, skipping parent invalidation', {
      oldSize,
      newSize: { width: newWidth, height: newHeight },
      containerProps: containerWithProps.__layoutProps,
      childCount: containerWithProps.list?.length ?? 0,
    })
    return
  }

  const newSize = { width: newWidth, height: newHeight }
  const now = Date.now()
  const guard = layoutCycleGuard.get(container)
  if (guard) {
    const repeatsPrev = guard.prev ? isCloseSize(guard.prev, newSize, LAYOUT_CYCLE_EPSILON) : false
    if (repeatsPrev && now - guard.lastTime < LAYOUT_CYCLE_TIME_MS) {
      guard.count += 1
    } else {
      guard.count = 0
    }
    guard.prev = guard.last
    guard.last = newSize
    guard.lastTime = now
    layoutCycleGuard.set(container, guard)

    if (guard.count >= LAYOUT_CYCLE_MAX) {
      DebugLogger.warn('layout', 'Layout cycle detected, skipping parent invalidation', {
        container,
        oldSize,
        newSize,
      })
      return
    }
  } else {
    layoutCycleGuard.set(container, {
      last: newSize,
      count: 0,
      lastTime: now,
    })
  }

  // Size changed - need to recalculate parent layout
  const parent = container.parentContainer as
    | (Phaser.GameObjects.Container & {
        __layoutProps?: LayoutProps
        __getLayoutSize?: () => { width: number; height: number }
      })
    | undefined

  if (!parent || !parent.__layoutProps) {
    return // No layout parent to invalidate
  }

  DebugLogger.log(
    'layout',
    'Container size changed, invalidating parent:',
    `${oldSize.width}x${oldSize.height} -> ${newWidth}x${newHeight}`
  )

  // Get parent's parent for context
  const grandParent = parent.parentContainer as
    | (Phaser.GameObjects.Container & {
        __layoutProps?: LayoutProps
        __getLayoutSize?: () => { width: number; height: number }
      })
    | undefined

  let grandParentSize: { width: number; height: number } | undefined
  if (grandParent && grandParent.__getLayoutSize) {
    const totalSize = grandParent.__getLayoutSize()
    const padding = (grandParent.__layoutProps?.padding ?? 0) as
      | number
      | { left?: number; right?: number; top?: number; bottom?: number }
    const normPadding =
      typeof padding === 'number'
        ? { left: padding, right: padding, top: padding, bottom: padding }
        : {
            left: padding.left ?? 0,
            right: padding.right ?? 0,
            top: padding.top ?? 0,
            bottom: padding.bottom ?? 0,
          }
    grandParentSize = {
      width: totalSize.width - normPadding.left - normPadding.right,
      height: totalSize.height - normPadding.top - normPadding.bottom,
    }
  }

  // Recalculate parent layout (will recursively invalidate grandparent if needed)
  calculateLayout(parent, parent.__layoutProps, grandParentSize)
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

  // Store old size before layout calculation for parent invalidation
  const containerWithLayout = container as typeof container & {
    __getLayoutSize?: () => { width: number; height: number }
  }
  const oldContainerSize = containerWithLayout.__getLayoutSize?.()

  // Debug: Track excessive layout calls
  // console.log('[LAYOUT] calculateLayout called for container with', children?.length ?? 0, 'children')

  if (!children || !Array.isArray(children)) {
    return
  }

  // Performance timing
  DebugLogger.time('performance', 'calculateLayout')

  // 1. Extract layout parameters
  const direction = containerProps.direction ?? 'column'
  const padding = normalizePadding(containerProps.padding)
  const gap = normalizeGap(containerProps.gap)
  const justifyContent = containerProps.justifyContent ?? 'start'

  DebugLogger.log('layout', `Direction: ${direction}, Padding:`, padding)

  // 2a. Pre-calculate container size if possible (needed for percentage children and nested containers)
  //     This allows percentage-based child sizes to resolve correctly and nested containers
  //     to receive the correct content-area as their parent size
  let currentContainerSize: { width: number; height: number } | undefined

  // Try to calculate width early if we have explicit width or can resolve from parent
  const parsedWidth = parseSize(containerProps.width)
  const canCalculateWidth =
    parsedWidth.type === 'fixed' ||
    (parentSize?.width !== undefined &&
      (parsedWidth.type === 'percent' ||
        parsedWidth.type === 'fill' ||
        parsedWidth.type === 'calc'))

  const width = canCalculateWidth
    ? resolveSize(parsedWidth, parentSize?.width, container.width, parentPadding?.horizontal)
    : undefined

  // Try to calculate height early if we have explicit height or can resolve from parent
  const parsedHeight = parseSize(containerProps.height)
  const canCalculateHeight =
    parsedHeight.type === 'fixed' ||
    (parentSize?.height !== undefined &&
      (parsedHeight.type === 'percent' ||
        parsedHeight.type === 'fill' ||
        parsedHeight.type === 'calc'))

  const height = canCalculateHeight
    ? resolveSize(parsedHeight, parentSize?.height, container.height, parentPadding?.vertical)
    : undefined

  // Set currentContainerSize if we could calculate at least one dimension
  if (width !== undefined || height !== undefined) {
    // Apply constraints
    const clampedWidth =
      width !== undefined
        ? clampSize(
            width,
            containerProps.minWidth,
            containerProps.maxWidth,
            parentSize?.width,
            container.width,
            parentPadding?.horizontal
          )
        : container.width
    const clampedHeight =
      height !== undefined
        ? clampSize(
            height,
            containerProps.minHeight,
            containerProps.maxHeight,
            parentSize?.height,
            container.height,
            parentPadding?.vertical
          )
        : container.height

    currentContainerSize = {
      width: clampedWidth,
      height: clampedHeight,
    }
  }

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

  // 2. Prepare layout children (filter backgrounds, headless objects, process nested containers)
  const layoutChildren: LayoutChild[] = []

  for (const child of children) {
    // Skip non-layout children (backgrounds, headless objects, missing __getLayoutSize)
    if (!isLayoutChild(child)) {
      DebugLogger.log('layout', 'Skipping non-layout child:', {
        isBackground: child.__isBackground,
        headless: child.__layoutProps?.headless,
        hasLayoutSize: typeof child.__getLayoutSize === 'function',
      })
      continue
    } // Skip processing nested containers with flex (they need parent size first)
    const hasFlex = (child.__layoutProps?.flex ?? 0) > 0
    if (!hasFlex) {
      // Process nested containers - pass content-area (size minus padding) as parent size
      // This ensures nested children see the correct available space
      const parentSizeForNested = currentContainerSize
        ? {
            width: currentContainerSize.width - padding.left - padding.right,
            height: currentContainerSize.height - padding.top - padding.bottom,
          }
        : parentSize
          ? {
              width: parentSize.width - (parentPadding?.horizontal ?? 0),
              height: parentSize.height - (parentPadding?.vertical ?? 0),
            }
          : undefined

      processNestedContainer(
        child,
        calculateLayout,
        parentSizeForNested,
        undefined // No padding offset needed since we pass content-area
      )
    }

    // Get child size - pass content-area (container size minus padding) for % and fill
    // This way percentages and fill are relative to available content space
    const contentAreaForChild = currentContainerSize
      ? {
          width: currentContainerSize.width - padding.left - padding.right,
          height: currentContainerSize.height - padding.top - padding.bottom,
        }
      : parentSize
        ? {
            width: parentSize.width - (parentPadding?.horizontal ?? 0),
            height: parentSize.height - (parentPadding?.vertical ?? 0),
          }
        : undefined

    const size = getChildSize(child, contentAreaForChild, undefined)
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

  // 5a. Check if wrapping is enabled
  const flexWrap = containerProps.flexWrap ?? 'nowrap'
  const shouldWrap = flexWrap !== 'nowrap' && direction !== 'stack'

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

  // 6a. Distribute flex space if there are flex children (skip if wrapping - will be done per line)
  let finalLayoutChildren = layoutChildren
  if (hasFlexChildren(layoutChildren) && !shouldWrap) {
    const contentSize =
      direction === 'row'
        ? containerWidth - padding.left - padding.right
        : containerHeight - padding.top - padding.bottom

    // Subtract gap space (gap appears between children, so n-1 gaps for n children)
    const gapValue = direction === 'row' ? gap.horizontal : gap.vertical
    const totalGapSpace = layoutChildren.length > 1 ? gapValue * (layoutChildren.length - 1) : 0
    const availableMainSpace = contentSize - totalGapSpace

    finalLayoutChildren = distributeFlexSpace(layoutChildren, availableMainSpace, direction)

    // Process nested flex containers now that they have their size
    for (const layoutChild of finalLayoutChildren) {
      const props = layoutChild.child.__layoutProps
      const isFlexItem =
        (props?.flex !== undefined && props.flex > 0) ||
        props?.flexShrink !== undefined ||
        props?.flexBasis !== undefined
      if (isFlexItem) {
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
  // Calculate total gap space (gaps between children, not before first or after last)
  const gapValue = direction === 'row' ? gap.horizontal : gap.vertical
  const totalGapSpace =
    finalLayoutChildren.length > 1 ? gapValue * (finalLayoutChildren.length - 1) : 0
  const remainingSpace = availableMainSpace - metrics.totalMainSize - totalGapSpace

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

  // 9a. Apply stretch if alignItems is 'stretch'
  const alignItems = containerProps.alignItems ?? 'start'
  if (alignItems === 'stretch' && direction !== 'stack') {
    for (const layoutChild of finalLayoutChildren) {
      const margin = getMargin(layoutChild.child)
      const child = layoutChild.child

      if (direction === 'row') {
        // Stretch height to full cross-axis (minus margins)
        const stretchHeight = contentArea.height - (margin.top ?? 0) - (margin.bottom ?? 0)
        layoutChild.size.height = Math.max(0, stretchHeight)

        // If child is a container with layout props, update its height prop and recalculate nested layout
        if (child.__layoutProps) {
          const originalHeight = child.__layoutProps.height
          child.__layoutProps = { ...child.__layoutProps, height: stretchHeight }

          // Recalculate nested container layout with new height
          processNestedContainer(child, calculateLayout, {
            width: containerWidth,
            height: containerHeight,
          })

          // Restore original height prop (in case it was percentage or undefined)
          child.__layoutProps = { ...child.__layoutProps, height: originalHeight }
        }
      } else if (direction === 'column') {
        // Stretch width to full cross-axis (minus margins)
        const stretchWidth = contentArea.width - (margin.left ?? 0) - (margin.right ?? 0)
        layoutChild.size.width = Math.max(0, stretchWidth)

        // If child is a container with layout props, update its width prop and recalculate nested layout
        if (child.__layoutProps) {
          const originalWidth = child.__layoutProps.width
          child.__layoutProps = { ...child.__layoutProps, width: stretchWidth }

          // Recalculate nested container layout with new width
          processNestedContainer(child, calculateLayout, {
            width: containerWidth,
            height: containerHeight,
          })

          // Restore original width prop (in case it was percentage or undefined)
          child.__layoutProps = { ...child.__layoutProps, width: originalWidth }
        }
      }
    }
  }

  // 10. Handle wrapping if enabled
  const positions: Position[] = []
  let adjustedContainerWidth = containerWidth
  let adjustedContainerHeight = containerHeight

  if (shouldWrap && 'wrapChildren' in strategy) {
    // Wrap children into multiple lines
    const availableMainSize = direction === 'row' ? contentArea.width : contentArea.height
    const mainGapValue = direction === 'row' ? gap.horizontal : gap.vertical
    const lines = (strategy as RowLayoutStrategy | ColumnLayoutStrategy).wrapChildren(
      finalLayoutChildren,
      availableMainSize,
      mainGapValue
    )

    if (flexWrap === 'wrap-reverse') {
      lines.reverse()
    }

    // Calculate total cross size needed for all lines
    const totalCrossSize = lines.reduce(
      (sum: number, line: LayoutLine) => sum + line.crossAxisSize,
      0
    )
    const crossGapValue = direction === 'row' ? gap.vertical : gap.horizontal
    const totalLineGaps = (lines.length - 1) * crossGapValue

    // Adjust container dimensions if auto-sizing and wrapping occurred
    if (
      direction === 'row' &&
      (containerProps.height === undefined || containerProps.height === 'auto')
    ) {
      // For row direction with auto-height, calculate height based on wrapped lines
      adjustedContainerHeight = totalCrossSize + totalLineGaps + padding.top + padding.bottom
    } else if (
      direction === 'column' &&
      (containerProps.width === undefined || containerProps.width === 'auto')
    ) {
      // For column direction with auto-width, calculate width based on wrapped lines
      adjustedContainerWidth = totalCrossSize + totalLineGaps + padding.left + padding.right
    }

    const availableCrossSize = direction === 'row' ? contentArea.height : contentArea.width
    const freeCrossSpace = availableCrossSize - totalCrossSize - totalLineGaps

    // Apply alignContent to distribute lines
    const alignContent = containerProps.alignContent ?? 'stretch'
    let crossOffset = 0
    let lineCrossSpacing = 0

    if (alignContent === 'center') {
      crossOffset = freeCrossSpace / 2
    } else if (alignContent === 'end') {
      crossOffset = freeCrossSpace
    } else if (alignContent === 'space-between' && lines.length > 1) {
      lineCrossSpacing = freeCrossSpace / (lines.length - 1)
    } else if (alignContent === 'space-around') {
      lineCrossSpacing = freeCrossSpace / lines.length
      crossOffset = lineCrossSpacing / 2
    }

    // Position children line by line
    for (const line of lines) {
      // Apply flex distribution per line if line has flex children
      let lineChildren = line.children
      if (hasFlexChildren(line.children)) {
        const lineGapSpace = (line.children.length - 1) * mainGapValue
        const lineAvailableSpace = availableMainSize - lineGapSpace
        lineChildren = distributeFlexSpace(line.children, lineAvailableSpace, direction)

        // Update line main size after flex distribution
        line.mainAxisSize = lineChildren.reduce((sum: number, child: LayoutChild) => {
          const size = direction === 'row' ? child.size.width : child.size.height
          const margin = getMargin(child.child)
          const marginSize =
            direction === 'row'
              ? (margin.left ?? 0) + (margin.right ?? 0)
              : (margin.top ?? 0) + (margin.bottom ?? 0)
          return sum + size + marginSize
        }, 0)
      }

      // Calculate line-specific justifyContent
      const lineMainSize = line.mainAxisSize
      const lineAvailableMain = availableMainSize
      const lineRemainingSpace = lineAvailableMain - lineMainSize
      const lineGapSpace = (line.children.length - 1) * mainGapValue
      const lineFreeSpace = lineRemainingSpace - lineGapSpace

      const lineJustifyResult = calculateJustifyContent(
        justifyContent,
        lineFreeSpace,
        line.children.length
      )

      let lineMainOffset = lineJustifyResult.mainStart
      const lineSpaceBetween = lineJustifyResult.spaceBetween

      // Position each child in the line
      for (let i = 0; i < lineChildren.length; i++) {
        const child = lineChildren[i]
        if (!child) continue

        const margin = getMargin(child.child)

        let x: number
        let y: number

        if (direction === 'row') {
          // Main axis: horizontal
          lineMainOffset += margin.left ?? 0
          x = padding.left + lineMainOffset

          // Cross axis: vertical
          const childCrossOffset = calculateAlignItems(
            alignItems,
            line.crossAxisSize,
            child.size.height,
            margin.top ?? 0,
            margin.bottom ?? 0
          )
          y = padding.top + crossOffset + childCrossOffset

          lineMainOffset += child.size.width + (margin.right ?? 0)
          if (i < lineChildren.length - 1) {
            lineMainOffset += mainGapValue + lineSpaceBetween
          }
        } else {
          // Main axis: vertical
          lineMainOffset += margin.top ?? 0
          y = padding.top + lineMainOffset

          // Cross axis: horizontal
          const childCrossOffset = calculateAlignItems(
            alignItems,
            line.crossAxisSize,
            child.size.width,
            margin.left ?? 0,
            margin.right ?? 0
          )
          x = padding.left + crossOffset + childCrossOffset

          lineMainOffset += child.size.height + (margin.bottom ?? 0)
          if (i < lineChildren.length - 1) {
            lineMainOffset += mainGapValue + lineSpaceBetween
          }
        }

        // Find child index in original array for correct position assignment
        const childIndex = finalLayoutChildren.indexOf(child)
        if (childIndex !== -1) {
          positions[childIndex] = { x, y }
        }
      }

      // Move to next line
      crossOffset += line.crossAxisSize + crossGapValue + lineCrossSpacing
    }
  } else {
    // No wrapping - use original single-line positioning
    let currentMain = mainStart

    for (let i = 0; i < finalLayoutChildren.length; i++) {
      const child = finalLayoutChildren[i]
      if (!child) continue

      const result = strategy.positionChild(child, i, context, currentMain)

      positions.push(result.position)
      currentMain = result.nextMain

      // Add gap and space-between spacing (not for stack)
      if (direction !== 'stack' && i < finalLayoutChildren.length - 1) {
        currentMain += gapValue + spaceBetween
      }
    }
  }

  // 11. Apply positions to children
  applyChildPositions(finalLayoutChildren, positions)

  // 12. Apply container dimensions (use adjusted dimensions if wrapping changed them)
  applyContainerDimensions(container, adjustedContainerWidth, adjustedContainerHeight)

  // 13. Update background and hit area
  updateBackground(container, adjustedContainerWidth, adjustedContainerHeight)

  updateHitArea(container, adjustedContainerWidth, adjustedContainerHeight)

  // 14. Apply overflow mask if needed
  applyOverflowMask(container, containerProps, adjustedContainerWidth, adjustedContainerHeight)

  // End performance timing
  DebugLogger.timeEnd('performance', 'calculateLayout')

  // 15. Propagate layout changes to parent if size changed
  // This ensures parent containers resize when child content changes
  invalidateParentLayoutIfNeeded(
    container,
    oldContainerSize,
    adjustedContainerWidth,
    adjustedContainerHeight
  )
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
