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
} from './gesture-types'
import { DEFAULT_GESTURE_CONFIG } from './gesture-types'

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

  private isInitialized = false

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
   * Bubble an event through overlapping containers
   * Iterates all containers at pointer position and calls handler until stopPropagation
   * @param pointer - The pointer that triggered the event
   * @param eventType - Type of event for filtering callbacks
   * @param handler - Function to call for each container, returns true if propagation stopped
   */
  private bubbleEvent(
    pointer: Phaser.Input.Pointer,
    eventType: keyof GestureCallbacks,
    handler: (state: GestureContainerState, localPos: { x: number; y: number }) => boolean | void
  ): void {
    // Get all containers at pointer position in reverse order (topmost first)
    const containersArray = Array.from(this.containers.values()).reverse()

    for (const state of containersArray) {
      // Only process containers that have the callback for this event type
      if (!state.callbacks[eventType]) continue

      // Check if pointer is within this container
      if (!this.isPointerInContainer(pointer, state)) continue

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
   * Iterates containers in reverse order (last registered = topmost = checked first)
   * This ensures overlapping containers respect z-order
   */
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    // Find which container was hit
    // Check in reverse order so topmost (last added) containers are checked first
    const containersArray = Array.from(this.containers.values()).reverse()
    for (const state of containersArray) {
      const isHit = this.isPointerInContainer(pointer, state)
      if (isHit) {
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
              const data = this.createEventData(
                pointer,
                localPos.x,
                localPos.y,
                state.hitArea.width,
                state.hitArea.height
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

        break // Only handle topmost container (no bubbling)
      }
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

    // Send final move event if callback exists
    if (state.callbacks.onTouchMove) {
      const localPos = this.getLocalPosition(pointer, state.container)
      const isInside = this.isPointerInContainer(pointer, state)
      const last = this.lastPointerPositions.get(pointer.id)
      const dx = last ? pointer.x - last.x : 0
      const dy = last ? pointer.y - last.y : 0

      const finalMoveData = this.createEventData(
        pointer,
        localPos.x,
        localPos.y,
        state.hitArea.width,
        state.hitArea.height,
        { dx, dy, isInside, state: 'end' }
      )
      state.callbacks.onTouchMove(finalMoveData)
    }

    // Reset first move flag
    if (state.callbacks.onTouchMove) {
      state.isFirstMove = undefined
    }

    // Check if pointer is still within the container (basic tap/click detection)
    // For now, we require pointer up to be inside - could be made configurable
    if (this.isPointerInContainer(pointer, state)) {
      // Fire onTouch only if:
      // - Long press wasn't triggered
      // - Touch duration is within acceptable range (not held too long)
      const shouldFireTouch = !state.longPressTriggered && !isTouchTooLong

      // Bubble onTouch event to parent containers
      if (state.callbacks.onTouch && shouldFireTouch) {
        this.bubbleEvent(pointer, 'onTouch', (targetState, targetLocalPos) => {
          const data = this.createEventData(
            pointer,
            targetLocalPos.x,
            targetLocalPos.y,
            targetState.hitArea.width,
            targetState.hitArea.height
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
            const data = this.createEventData(
              pointer,
              targetLocalPos.x,
              targetLocalPos.y,
              targetState.hitArea.width,
              targetState.hitArea.height
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

    // Reset state
    state.longPressTriggered = false
    state.pointerDownTime = undefined

    this.activePointerDown = null
    state.pointerDownPosition = undefined
  }

  /**
   * Handle global pointer move event
   * This fires for ALL registered containers with onTouchMove, even if pointer is outside
   */
  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    // Calculate delta
    const last = this.lastPointerPositions.get(pointer.id)
    const dx = last ? pointer.x - last.x : 0
    const dy = last ? pointer.y - last.y : 0
    this.lastPointerPositions.set(pointer.id, { x: pointer.x, y: pointer.y })

    // Notify all containers that have onTouchMove and an active pointer down
    // NOTE: Currently only notifies the container where pointer was pressed down
    // TODO: Consider if we should notify ALL containers during move (configurable?)
    if (this.activePointerDown && pointer.id === this.activePointerDown.pointerId) {
      const state = this.containers.get(this.activePointerDown.container)
      if (state?.callbacks.onTouchMove) {
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
      }
    }
  }

  /**
   * Check if pointer is within a container's hit area
   */
  private isPointerInContainer(
    pointer: Phaser.Input.Pointer,
    state: GestureContainerState
  ): boolean {
    const container = state.container
    if (!container.visible || container.alpha === 0) return false

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
   * Cleanup all resources
   */
  private destroy(): void {
    // Clear all timers
    for (const state of this.containers.values()) {
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer)
      }
    }

    this.containers.clear()
    this.lastPointerPositions.clear()
    this.activePointerDown = null

    // Remove event listeners
    if (this.isInitialized) {
      this.scene.input.off('pointerdown', this.handlePointerDown, this)
      this.scene.input.off('pointerup', this.handlePointerUp, this)
      this.scene.input.off('pointermove', this.handlePointerMove, this)
    }

    this.isInitialized = false
  }
}

/**
 * Get or create the GestureManager for a scene
 * Stored in scene.data to ensure singleton per scene
 */
export function getGestureManager(scene: Phaser.Scene): GestureManager {
  const key = '__gestureManager__'
  let manager = scene.data.get(key) as GestureManager | undefined

  if (!manager) {
    manager = new GestureManager(scene)
    scene.data.set(key, manager)
  }

  return manager
}
