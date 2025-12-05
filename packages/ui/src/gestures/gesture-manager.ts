/**
 * Global gesture manager for high-level touch and mouse interactions
 * Uses global Phaser input events to track gestures even when pointer moves outside bounds
 */
import Phaser from 'phaser'
import type {
  GestureCallbacks,
  GestureConfig,
  GestureContainerState,
  GestureEventData,
  HoverEventData,
  WheelEventData,
} from './gesture-types'
import { DEFAULT_GESTURE_CONFIG } from './gesture-types'

// Global counter for unique mount root IDs
let nextMountRootId = 1

/**
 * Generate unique mount root ID for mountJSX isolation
 * @returns Unique root ID
 */
export function generateMountRootId(): number {
  return nextMountRootId++
}

/**
 * Manager for gesture detection across all containers in a scene
 * Singleton per scene, stored in scene.data
 */
export class GestureManager {
  private scene: Phaser.Scene
  private containers = new Map<Phaser.GameObjects.Container, GestureContainerState>()

  // Track pointer positions for delta calculation
  private lastPointerPositions = new Map<number, { x: number; y: number }>()

  // Track active pointer down for touch detection
  private activePointerDown: {
    pointerId: number
    container: Phaser.GameObjects.Container
    startX: number
    startY: number
  } | null = null

  // Track which containers were hit during pointer down (for move event filtering)
  private activeContainersForMove = new Map<number, Set<Phaser.GameObjects.Container>>()

  // Track hover state for each container (desktop/mouse only)
  private hoveredContainers = new Map<Phaser.GameObjects.Container, boolean>()

  // Track pending setTimeout timers for cleanup
  private pendingTimeouts = new Set<number>()

  private isInitialized = false
  private isDestroyed = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Initialize global event listeners (called once per scene)
   */
  private initialize(): void {
    if (this.isInitialized) return
    this.isInitialized = true

    // Global pointer down - detect which container was hit
    this.scene.input.on('pointerdown', this.handlePointerDown, this)

    // Global pointer up - check for touch/tap completion
    this.scene.input.on('pointerup', this.handlePointerUp, this)

    // Global pointer move - track deltas and notify all relevant containers
    this.scene.input.on('pointermove', this.handlePointerMove, this)

    // Handle pointer up outside canvas (window-level events)
    // This ensures we catch pointer release even when it happens outside the game canvas
    this.handleGlobalPointerUp = this.handleGlobalPointerUp.bind(this)
    window.addEventListener('mouseup', this.handleGlobalPointerUp)
    window.addEventListener('touchend', this.handleGlobalPointerUp)

    // Handle mouse wheel events (desktop only)
    // Use window instead of canvas to ensure we catch all wheel events
    this.handleWheel = this.handleWheel.bind(this)
    window.addEventListener('wheel', this.handleWheel, { passive: false })

    // Cleanup on scene shutdown
    this.scene.events.once('shutdown', this.destroy, this)
  }

  /**
   * Register a container for gesture tracking
   * @param container - Container to track
   * @param callbacks - Gesture event callbacks
   * @param hitArea - Interactive hit area
   * @param config - Gesture configuration
   */
  registerContainer(
    container: Phaser.GameObjects.Container,
    callbacks: GestureCallbacks,
    hitArea: Phaser.Geom.Rectangle,
    config: GestureConfig = {}
  ): void {
    this.initialize()

    const state: GestureContainerState = {
      container,
      callbacks,
      config: { ...DEFAULT_GESTURE_CONFIG, ...config },
      hitArea,
    }

    this.containers.set(container, state)

    // Cleanup when container is destroyed
    container.once('destroy', () => {
      this.unregisterContainer(container)
    })
  }

  /**
   * Unregister a container
   * @param container - Container to remove
   */
  unregisterContainer(container: Phaser.GameObjects.Container): void {
    const state = this.containers.get(container)
    if (!state) return

    // Clear any pending timers
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer)
    }

    this.containers.delete(container)

    // If this was the active pointer down target, clear it
    if (this.activePointerDown?.container === container) {
      this.activePointerDown = null
    }

    // Clear hover state
    this.hoveredContainers.delete(container)
  }

  /**
   * Check if a container is registered
   * @param container - Container to check
   * @returns True if container is registered
   */
  hasContainer(container: Phaser.GameObjects.Container): boolean {
    return this.containers.has(container)
  }

  /**
   * Create a gesture event data object with propagation control
   * @param pointer - Phaser pointer
   * @param localX - Local X coordinate
   * @param localY - Local Y coordinate
   * @param width - Hit area width
   * @param height - Hit area height
   * @param options - Optional additional data (dx, dy, isInside, state)
   * @returns Event data with stopPropagation support
   */
  private createEventData(
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    width: number,
    height: number,
    options: {
      dx?: number
      dy?: number
      isInside?: boolean
      state?: 'start' | 'move' | 'end'
    } = {}
  ): GestureEventData {
    let propagationStopped = false

    return {
      pointer,
      localX,
      localY,
      width,
      height,
      ...options,
      stopPropagation() {
        propagationStopped = true
      },
      isPropagationStopped() {
        return propagationStopped
      },
    }
  }

  /**
   * Get effective depth considering entire parent hierarchy
   * @param container - Container to calculate depth for
   * @returns Accumulated depth from container and all parents
   */
  private getEffectiveDepth(container: Phaser.GameObjects.Container): number {
    let depth = container.depth
    let parent = container.parentContainer

    // Walk up parent chain and accumulate depths
    while (parent) {
      depth += parent.depth
      parent = parent.parentContainer
    }

    return depth
  }

  /**
   * Get mount root ID from container hierarchy
   * Walks up to find the topmost container with __mountRootId
   * @param container - Container to check
   * @returns Mount root ID or 0 if none found
   */
  private getRootId(container: Phaser.GameObjects.Container): number {
    let current: Phaser.GameObjects.Container | null = container
    let rootId = 0

    while (current) {
      const id = (current as unknown as { __mountRootId?: number }).__mountRootId
      if (id !== undefined) {
        rootId = id
      }
      current = current.parentContainer
    }

    return rootId
  }

  /**
   * Bubble an event through overlapping containers
   * Iterates all containers at pointer position and calls handler until stopPropagation
   * Sorts containers by their actual display list order (z-index) to respect visual stacking
   * @param pointer - The pointer that triggered the event
   * @param eventType - Type of event for filtering callbacks
   * @param handler - Function to call for each container, returns true if propagation stopped
   * @param filterSet - Optional set of containers to limit bubbling to (for move events)
   * @param skipContainerCheck - Skip the isPointerInContainer check (for final move events)
   */
  private bubbleEvent(
    pointer: Phaser.Input.Pointer,
    eventType: keyof GestureCallbacks,
    handler: (state: GestureContainerState, localPos: { x: number; y: number }) => boolean | void,
    filterSet?: Set<Phaser.GameObjects.Container>,
    skipContainerCheck = false
  ): void {
    // Get all containers at pointer position with their original indices
    const containersArray = Array.from(this.containers.values()).map((state, originalIndex) => ({
      state,
      originalIndex,
    }))

    // Sort by: 1) mountRootId (higher = on top), 2) effective depth, 3) display list order
    // This ensures different mountJSX trees are properly isolated
    containersArray.sort((a, b) => {
      const containerA = a.state.container
      const containerB = b.state.container

      // First: Compare mount root IDs (higher = mounted later = on top)
      const rootIdA = this.getRootId(containerA)
      const rootIdB = this.getRootId(containerB)
      if (rootIdA !== rootIdB) {
        return rootIdB - rootIdA // Higher root ID first
      }

      // Second: Compare effective depths (accumulated from parent hierarchy)
      const depthA = this.getEffectiveDepth(containerA)
      const depthB = this.getEffectiveDepth(containerB)
      if (depthA !== depthB) {
        return depthB - depthA // Higher depth first
      }

      // Third: If they share the same parent, compare their indices in the parent's display list
      if (containerA.parentContainer === containerB.parentContainer && containerA.parentContainer) {
        const indexA = containerA.parentContainer.getIndex(containerA)
        const indexB = containerB.parentContainer.getIndex(containerB)
        const diff = indexB - indexA // Higher index first (topmost)

        // If display list indices are equal, preserve original registration order
        if (diff !== 0) return diff
      }

      // Fall back to original registration order (reverse for topmost first)
      return b.originalIndex - a.originalIndex
    })

    for (const { state } of containersArray) {
      // Only process containers that have the callback for this event type
      if (!state.callbacks[eventType]) continue

      // If filterSet provided, only process containers in the set
      if (filterSet && !filterSet.has(state.container)) continue

      // Check if pointer is within this container (unless skipContainerCheck is true)
      if (!skipContainerCheck && !this.isPointerInContainer(pointer, state)) continue

      // Calculate local position
      const localPos = this.getLocalPosition(pointer, state.container)

      // Call handler and check if propagation was stopped
      const stopped = handler(state, localPos)
      if (stopped) break
    }
  }

  /**
   * Update hit area for a container
   * @param container - Container to update
   * @param hitArea - New hit area
   */
  updateHitArea(container: Phaser.GameObjects.Container, hitArea: Phaser.Geom.Rectangle): void {
    const state = this.containers.get(container)
    if (state) {
      state.hitArea = hitArea
    }
  }

  /**
   * Update callbacks for a container
   * @param container - Container to update
   * @param callbacks - New callbacks
   */
  updateCallbacks(container: Phaser.GameObjects.Container, callbacks: GestureCallbacks): void {
    const state = this.containers.get(container)
    if (state) {
      state.callbacks = callbacks
    }
  }

  /**
   * Handle global pointer down event
   * Registers all containers that were hit for move event tracking
   * Only the topmost gets touch/longpress callbacks
   */
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    // Create set to track all hit containers for this pointer
    const hitContainers = new Set<Phaser.GameObjects.Container>()

    // Find which containers were hit
    // Sort by: 1) mountRootId, 2) effective depth, 3) display list order
    const containersArray = Array.from(this.containers.values()).map((state, originalIndex) => ({
      state,
      originalIndex,
    }))
    containersArray.sort((a, b) => {
      const containerA = a.state.container
      const containerB = b.state.container

      // First: Compare mount root IDs
      const rootIdA = this.getRootId(containerA)
      const rootIdB = this.getRootId(containerB)

      if (rootIdA !== rootIdB) {
        return rootIdB - rootIdA
      }

      // Second: Compare effective depths
      const depthA = this.getEffectiveDepth(containerA)
      const depthB = this.getEffectiveDepth(containerB)
      if (depthA !== depthB) {
        return depthB - depthA
      }

      // Third: Compare display list indices if same parent
      if (containerA.parentContainer === containerB.parentContainer && containerA.parentContainer) {
        const indexA = containerA.parentContainer.getIndex(containerA)
        const indexB = containerB.parentContainer.getIndex(containerB)
        const diff = indexB - indexA // Higher index first (topmost)

        // If display list indices are equal, preserve original registration order
        if (diff !== 0) return diff
      }

      // Fall back to original registration order (reverse for topmost first)
      return b.originalIndex - a.originalIndex
    })

    let isFirstHit = true

    for (const { state } of containersArray) {
      const isHit = this.isPointerInContainer(pointer, state)
      if (isHit) {
        // Add to hit set (for move event filtering)
        hitContainers.add(state.container)

        // Only the first (topmost) hit gets touch/longpress handling
        if (isFirstHit) {
          isFirstHit = false
          const localPos = this.getLocalPosition(pointer, state.container)

          // Store active pointer down for touch detection
          this.activePointerDown = {
            pointerId: pointer.id,
            container: state.container,
            startX: pointer.x,
            startY: pointer.y,
          }

          // Reset long press triggered flag
          state.longPressTriggered = false

          // Store down time for touch duration check
          state.pointerDownTime = Date.now()

          // Start long press timer if callback exists
          if (state.callbacks.onLongPress) {
            state.longPressTimer = setTimeout(() => {
              if (this.activePointerDown?.container === state.container) {
                const isInside = this.isPointerInContainer(pointer, state)
                const data = this.createEventData(
                  pointer,
                  localPos.x,
                  localPos.y,
                  state.hitArea.width,
                  state.hitArea.height,
                  { isInside }
                )
                state.callbacks.onLongPress?.(data)

                // Mark that long press was triggered to prevent onTouch
                state.longPressTriggered = true
                this.activePointerDown = null
              }
            }, state.config.longPressDuration)
          }

          // Store down position for tracking
          state.pointerDownPosition = { x: pointer.x, y: pointer.y }
        }
      }
    }

    // Store hit containers for move event filtering
    if (hitContainers.size > 0) {
      this.activeContainersForMove.set(pointer.id, hitContainers)
    }
  }

  /**
   * Handle global pointer up event
   */
  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.activePointerDown || this.activePointerDown.pointerId !== pointer.id) {
      return
    }

    const state = this.containers.get(this.activePointerDown.container)
    if (!state) {
      this.activePointerDown = null
      return
    }

    // Clear long press timer if still pending
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer)
      state.longPressTimer = undefined
    }

    // Calculate touch duration
    const touchDuration = state.pointerDownTime ? Date.now() - state.pointerDownTime : 0
    const isTouchTooLong = touchDuration > state.config.maxTouchDuration

    // Send final move event to containers that were hit during pointer down
    const last = this.lastPointerPositions.get(pointer.id)
    const dx = last ? pointer.x - last.x : 0
    const dy = last ? pointer.y - last.y : 0
    const hitContainers = this.activeContainersForMove.get(pointer.id)

    this.bubbleEvent(
      pointer,
      'onTouchMove',
      (targetState, targetLocalPos) => {
        const isInside = this.isPointerInContainer(pointer, targetState)
        const finalMoveData = this.createEventData(
          pointer,
          targetLocalPos.x,
          targetLocalPos.y,
          targetState.hitArea.width,
          targetState.hitArea.height,
          { dx, dy, isInside, state: 'end' }
        )
        targetState.callbacks.onTouchMove?.(finalMoveData)

        // Reset first move flag for this container
        targetState.isFirstMove = undefined

        return finalMoveData.isPropagationStopped()
      },
      hitContainers,
      true // Skip container check for final move event
    )

    // Check if pointer is still within the container (basic tap/click detection)
    const isInside = this.isPointerInContainer(pointer, state)

    if (isInside) {
      // Fire onTouch only if:
      // - Long press wasn't triggered
      // - Touch duration is within acceptable range (not held too long)
      const shouldFireTouch = !state.longPressTriggered && !isTouchTooLong

      // Bubble onTouch event to parent containers
      if (state.callbacks.onTouch && shouldFireTouch) {
        this.bubbleEvent(pointer, 'onTouch', (targetState, targetLocalPos) => {
          const isInside = this.isPointerInContainer(pointer, targetState)
          const data = this.createEventData(
            pointer,
            targetLocalPos.x,
            targetLocalPos.y,
            targetState.hitArea.width,
            targetState.hitArea.height,
            { isInside }
          )
          targetState.callbacks.onTouch?.(data)
          return data.isPropagationStopped()
        })
      }

      // Check for double tap (also skip if touch was too long)
      if (state.callbacks.onDoubleTap && shouldFireTouch) {
        const now = Date.now()
        const timeSinceLastTap = state.lastTapTime ? now - state.lastTapTime : Infinity

        if (timeSinceLastTap <= state.config.doubleTapDelay) {
          this.bubbleEvent(pointer, 'onDoubleTap', (targetState, targetLocalPos) => {
            const isInside = this.isPointerInContainer(pointer, targetState)
            const data = this.createEventData(
              pointer,
              targetLocalPos.x,
              targetLocalPos.y,
              targetState.hitArea.width,
              targetState.hitArea.height,
              { isInside }
            )
            targetState.callbacks.onDoubleTap?.(data)
            return data.isPropagationStopped()
          })
          state.lastTapTime = undefined // Reset to prevent triple-tap
        } else {
          state.lastTapTime = now
        }
      }
    }

    // Fire onTouchOutside for ALL containers where pointer is outside
    for (const [container, containerState] of this.containers) {
      if (!containerState.callbacks.onTouchOutside) continue

      const isInsideContainer = this.isPointerInContainer(pointer, containerState)
      if (isInsideContainer) continue // Skip if pointer is inside

      // Fire onTouchOutside - no touch duration check needed for outside clicks
      const localPos = this.getLocalPosition(pointer, container)
      const data = this.createEventData(
        pointer,
        localPos.x,
        localPos.y,
        containerState.hitArea.width,
        containerState.hitArea.height,
        { isInside: false }
      )
      containerState.callbacks.onTouchOutside(data)
    }

    // Reset state
    state.longPressTriggered = false
    state.pointerDownTime = undefined

    this.activePointerDown = null
    state.pointerDownPosition = undefined

    // Clear active containers for move tracking
    this.activeContainersForMove.delete(pointer.id)
  }

  /**
   * Handle pointer up outside canvas (global window events)
   * Ensures touch move 'end' state is sent even when pointer released outside
   * Also handles onTouchOutside for ALL containers
   */
  private handleGlobalPointerUp(_event: MouseEvent | TouchEvent): void {
    // Use setTimeout to let Phaser's handlePointerUp run first (if inside canvas)
    const timerId = window.setTimeout(() => {
      // Remove timer from tracking
      this.pendingTimeouts.delete(timerId)

      // Guard: Check if manager is destroyed or scene is invalid
      if (this.isDestroyed || !this.scene || !this.scene.input) {
        return
      }

      // CRITICAL: activePointer is a getter that can throw if scene is being destroyed
      // Wrap in try-catch to handle race condition during scene destruction
      let pointer: Phaser.Input.Pointer | null = null
      try {
        pointer = this.scene.input.activePointer
      } catch (error) {
        // Scene is being destroyed, silently ignore
        return
      }

      if (!pointer) {
        return
      }

      // Fire onTouchOutside for ALL containers that have the callback
      // and where the pointer is NOT inside
      for (const state of this.containers.values()) {
        if (!state.callbacks.onTouchOutside) continue

        const isInside = this.isPointerInContainer(pointer, state)
        if (isInside) continue // Skip if pointer is inside

        // Check if touch duration is valid
        const touchDuration = state.pointerDownTime ? Date.now() - state.pointerDownTime : 0
        const isTouchTooLong = touchDuration > state.config.maxTouchDuration
        const shouldFire = !state.longPressTriggered && !isTouchTooLong

        if (shouldFire) {
          const localPos = this.getLocalPosition(pointer, state.container)
          const data = this.createEventData(
            pointer,
            localPos.x,
            localPos.y,
            state.hitArea.width,
            state.hitArea.height,
            { isInside: false }
          )
          state.callbacks.onTouchOutside?.(data)
        }
      }

      // If no activePointerDown, we're done
      if (!this.activePointerDown) return

      const state = this.containers.get(this.activePointerDown.container)
      if (!state) {
        this.activePointerDown = null
        return
      }

      // Clear long press timer if still pending
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer)
        state.longPressTimer = undefined
      }

      // Send final move event with 'end' state to all active containers
      const last = this.lastPointerPositions.get(pointer.id)
      const dx = last ? pointer.x - last.x : 0
      const dy = last ? pointer.y - last.y : 0
      const hitContainers = this.activeContainersForMove.get(pointer.id)

      this.bubbleEvent(
        pointer,
        'onTouchMove',
        (targetState, targetLocalPos) => {
          const finalMoveData = this.createEventData(
            pointer,
            targetLocalPos.x,
            targetLocalPos.y,
            targetState.hitArea.width,
            targetState.hitArea.height,
            { dx, dy, isInside: false, state: 'end' }
          )
          targetState.callbacks.onTouchMove?.(finalMoveData)

          // Reset first move flag for this container
          targetState.isFirstMove = undefined

          return finalMoveData.isPropagationStopped()
        },
        hitContainers,
        true // Skip container check for final move event
      )

      // Reset state
      state.longPressTriggered = false
      state.pointerDownTime = undefined
      this.activePointerDown = null
      state.pointerDownPosition = undefined

      // Clear active containers for this pointer
      this.activeContainersForMove.delete(pointer.id)
    }, 0)

    // Track this timer for cleanup
    this.pendingTimeouts.add(timerId)
  }

  /**
   * Handle global pointer move event
   * Detects hover state changes and notifies containers with onHoverStart/onHoverEnd
   * Only notifies containers that were hit during pointer down for onTouchMove
   * Bubbles through them until stopPropagation() is called
   */
  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    // Calculate delta
    const last = this.lastPointerPositions.get(pointer.id)
    const dx = last ? pointer.x - last.x : 0
    const dy = last ? pointer.y - last.y : 0
    this.lastPointerPositions.set(pointer.id, { x: pointer.x, y: pointer.y })

    // Hover detection for all containers (desktop/mouse only)
    this.detectHoverChanges(pointer)

    // Only process touch move if there's an active pointer down
    if (!this.activePointerDown || pointer.id !== this.activePointerDown.pointerId) {
      return
    }

    // Get containers that were hit during pointer down
    const hitContainers = this.activeContainersForMove.get(pointer.id)
    if (!hitContainers) return

    // Bubble onTouchMove only to containers that were hit at pointer down
    // Sort by: 1) mountRootId, 2) effective depth, 3) display list order
    const containersArray = Array.from(this.containers.values()).map((state, originalIndex) => ({
      state,
      originalIndex,
    }))
    containersArray.sort((a, b) => {
      const containerA = a.state.container
      const containerB = b.state.container

      // First: Compare mount root IDs
      const rootIdA = this.getRootId(containerA)
      const rootIdB = this.getRootId(containerB)
      if (rootIdA !== rootIdB) {
        return rootIdB - rootIdA
      }

      // Second: Compare effective depths
      const depthA = this.getEffectiveDepth(containerA)
      const depthB = this.getEffectiveDepth(containerB)
      if (depthA !== depthB) {
        return depthB - depthA
      }

      // Third: Compare display list indices if same parent
      if (containerA.parentContainer === containerB.parentContainer && containerA.parentContainer) {
        const indexA = containerA.parentContainer.getIndex(containerA)
        const indexB = containerB.parentContainer.getIndex(containerB)
        const diff = indexB - indexA // Higher index first (topmost)

        // If display list indices are equal, preserve original registration order
        if (diff !== 0) return diff
      }

      // Fall back to original registration order (reverse for topmost first)
      return b.originalIndex - a.originalIndex
    })

    for (const { state } of containersArray) {
      // Only process if:
      // 1. Container has onTouchMove callback
      // 2. Container was hit during pointer down
      if (!state.callbacks.onTouchMove) continue
      if (!hitContainers.has(state.container)) continue

      const localPos = this.getLocalPosition(pointer, state.container)
      const isInside = this.isPointerInContainer(pointer, state)

      // Determine state: 'start' for first move, 'move' for subsequent
      const moveState = state.isFirstMove === undefined ? 'start' : 'move'
      if (state.isFirstMove === undefined) {
        state.isFirstMove = false
      }

      const data = this.createEventData(
        pointer,
        localPos.x,
        localPos.y,
        state.hitArea.width,
        state.hitArea.height,
        { dx, dy, isInside, state: moveState }
      )

      state.callbacks.onTouchMove(data)

      // Stop bubbling if propagation was stopped
      if (data.isPropagationStopped()) break
    }
  }

  /**
   * Check if pointer is within a container's hit area
   * Also checks parent visibility chain to handle collapsed accordions
   */
  private isPointerInContainer(
    pointer: Phaser.Input.Pointer,
    state: GestureContainerState
  ): boolean {
    const container = state.container
    if (!container.visible || container.alpha === 0) return false

    // Check parent container visibility chain
    // This prevents interaction with children in collapsed accordions
    let parent = container.parentContainer
    while (parent) {
      if (!parent.visible || parent.alpha === 0) return false
      parent = parent.parentContainer
    }

    const localPos = this.getLocalPosition(pointer, container)
    return state.hitArea.contains(localPos.x, localPos.y)
  }

  /**
   * Convert global pointer position to container local coordinates
   */
  private getLocalPosition(
    pointer: Phaser.Input.Pointer,
    container: Phaser.GameObjects.Container
  ): { x: number; y: number } {
    // Transform global coordinates to container's local space
    const matrix = container.getWorldTransformMatrix()
    const inverseMatrix = matrix.invert()

    const localPos = inverseMatrix.transformPoint(pointer.x, pointer.y)
    return { x: localPos.x, y: localPos.y }
  }

  /**
   * Detect hover state changes for all containers (desktop/mouse only)
   * Called on every pointer move to update hover state
   */
  private detectHoverChanges(pointer: Phaser.Input.Pointer): void {
    for (const [container, state] of this.containers) {
      // Skip if container has no hover callbacks
      if (!state.callbacks.onHoverStart && !state.callbacks.onHoverEnd) {
        continue
      }

      // Check if container is active and visible
      if (!container.active) continue

      const isInside = this.isPointerInContainer(pointer, state)
      const wasInside = this.hoveredContainers.get(container) ?? false

      // Hover start
      if (isInside && !wasInside) {
        this.hoveredContainers.set(container, true)
        if (state.callbacks.onHoverStart) {
          const eventData = this.createHoverEventData(pointer, container, state.hitArea)
          state.callbacks.onHoverStart(eventData)
        }
      }

      // Hover end
      if (!isInside && wasInside) {
        this.hoveredContainers.set(container, false)
        if (state.callbacks.onHoverEnd) {
          const eventData = this.createHoverEventData(pointer, container, state.hitArea)
          state.callbacks.onHoverEnd(eventData)
        }
      }
    }
  }

  /**
   * Create hover event data
   */
  private createHoverEventData(
    pointer: Phaser.Input.Pointer,
    container: Phaser.GameObjects.Container,
    hitArea: Phaser.Geom.Rectangle
  ): HoverEventData {
    const localPos = this.getLocalPosition(pointer, container)

    let propagationStopped = false

    return {
      pointer,
      localX: localPos.x,
      localY: localPos.y,
      width: hitArea.width,
      height: hitArea.height,
      stopPropagation: () => {
        propagationStopped = true
      },
      isPropagationStopped: () => propagationStopped,
    }
  }

  /**
   * Handle mouse wheel event
   * Bubbles to all containers under the pointer
   */
  private handleWheel(event: WheelEvent): void {
    // Get active pointer and update its position from the wheel event
    const pointer = this.scene.input.activePointer
    if (!pointer) return

    // Update pointer position from wheel event (it might not be at correct position)
    const canvas = this.scene.game.canvas
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    pointer.x = (event.clientX - rect.left) * scaleX
    pointer.y = (event.clientY - rect.top) * scaleY

    // Find all containers under the pointer
    const containersUnderPointer: Array<{
      state: GestureContainerState
      originalIndex: number
    }> = []

    Array.from(this.containers.values()).forEach((state, originalIndex) => {
      if (!state.callbacks.onWheel) return

      const isInside = this.isPointerInContainer(pointer, state)
      if (isInside) {
        containersUnderPointer.push({ state, originalIndex })
      }
    })

    // Sort by z-order (same logic as other events)
    containersUnderPointer.sort((a, b) => {
      const containerA = a.state.container
      const containerB = b.state.container

      // First: Compare mount root IDs
      const rootIdA = this.getRootId(containerA)
      const rootIdB = this.getRootId(containerB)
      if (rootIdA !== rootIdB) {
        return rootIdB - rootIdA
      }

      // Second: Compare effective depths
      const depthA = this.getEffectiveDepth(containerA)
      const depthB = this.getEffectiveDepth(containerB)
      if (depthA !== depthB) {
        return depthB - depthA
      }

      // Third: Compare display list indices if same parent
      if (containerA.parentContainer === containerB.parentContainer && containerA.parentContainer) {
        const indexA = containerA.parentContainer.getIndex(containerA)
        const indexB = containerB.parentContainer.getIndex(containerB)
        const diff = indexB - indexA
        if (diff !== 0) return diff
      }

      return b.originalIndex - a.originalIndex
    })

    // Bubble wheel event through containers
    for (const { state } of containersUnderPointer) {
      const localPos = this.getLocalPosition(pointer, state.container)

      let propagationStopped = false

      const wheelData: WheelEventData = {
        pointer,
        localX: localPos.x,
        localY: localPos.y,
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ,
        deltaMode: event.deltaMode,
        width: state.hitArea.width,
        height: state.hitArea.height,
        originalEvent: event,
        stopPropagation: () => {
          propagationStopped = true
        },
        isPropagationStopped: () => propagationStopped,
        preventDefault: () => {
          event.preventDefault()
        },
      }

      state.callbacks.onWheel?.(wheelData)

      // Stop bubbling if propagation was stopped
      if (propagationStopped) break
    }
  }

  /**
   * Cleanup all resources
   */
  private destroy(): void {
    console.log('[GestureManager] destroy() called', {
      pendingTimeouts: this.pendingTimeouts.size,
      containers: this.containers.size,
    })

    // Mark as destroyed to prevent any pending callbacks from executing
    this.isDestroyed = true

    // Clear all pending setTimeout timers
    for (const timerId of this.pendingTimeouts) {
      clearTimeout(timerId)
    }
    this.pendingTimeouts.clear()

    // Clear all container timers
    for (const state of this.containers.values()) {
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer)
      }
    }

    this.containers.clear()
    this.lastPointerPositions.clear()
    this.activePointerDown = null
    this.hoveredContainers.clear()

    // Remove event listeners
    if (this.isInitialized) {
      this.scene.input.off('pointerdown', this.handlePointerDown, this)
      this.scene.input.off('pointerup', this.handlePointerUp, this)
      this.scene.input.off('pointermove', this.handlePointerMove, this)

      // Remove global window event listeners
      window.removeEventListener('mouseup', this.handleGlobalPointerUp)
      window.removeEventListener('touchend', this.handleGlobalPointerUp)

      // Remove wheel event listener
      window.removeEventListener('wheel', this.handleWheel)
    }

    this.isInitialized = false
  }
}

/**
 * Get or create GestureManager for a scene
 * Stored in scene.data to ensure singleton per scene
 */
export function getGestureManager(scene: Phaser.Scene): GestureManager {
  // Safety check: ensure scene.data exists
  if (!scene || !scene.data) {
    throw new Error('getGestureManager: Invalid scene or scene.data is undefined')
  }

  const key = '__gestureManager__'
  let manager = scene.data.get(key) as GestureManager | undefined

  if (!manager) {
    manager = new GestureManager(scene)
    scene.data.set(key, manager)
  }

  return manager
}
