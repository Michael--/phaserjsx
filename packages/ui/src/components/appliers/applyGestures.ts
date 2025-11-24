/**
 * Gesture property appliers for component patching
 * Updates gesture registration when props change
 */
import type { LayoutSize } from '@phaserjsx/ui/layout'
import Phaser from 'phaser'
import type { GestureProps, LayoutProps } from '../../core-props'
import { getGestureManager } from '../../gestures/gesture-manager'
import type { GestureCallbacks } from '../../gestures/gesture-types'

/**
 * Applies gesture properties when props change
 * Handles enabling/disabling gestures, updating callbacks, and hit area changes
 * @param scene - Scene containing the gesture manager
 * @param container - Phaser Container to update gestures on
 * @param prev - Previous props
 * @param next - New props
 */
export function applyGesturesProps(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  prev: Partial<GestureProps & LayoutProps>,
  next: Partial<GestureProps & LayoutProps>
): void {
  // Safety check: ensure scene is valid and booted
  if (!scene || !scene.sys || !scene.data) {
    console.warn('applyGesturesProps: Invalid scene or scene not initialized')
    return
  }

  // Check if scene is still active (not shutting down/destroyed)
  if (!scene.sys.isActive() || scene.sys.game === null) {
    console.warn('applyGesturesProps: Scene is not active or game is null')
    return
  }

  const hasAnyGesture = !!(next.onTouch || next.onTouchMove || next.onDoubleTap || next.onLongPress)
  const hadAnyGesture = !!(prev.onTouch || prev.onTouchMove || prev.onDoubleTap || prev.onLongPress)

  // Auto-enable if callbacks present, unless explicitly disabled
  const prevEnabled = hadAnyGesture && prev.enableGestures !== false
  const nextEnabled = hasAnyGesture && next.enableGestures !== false

  const manager = getGestureManager(scene)

  // Case 1: Gestures newly enabled
  if (!prevEnabled && nextEnabled && hasAnyGesture) {
    // Register for the first time
    // Use __getLayoutSize for actual calculated dimensions
    const containerWithLayout = container as typeof container & {
      __getLayoutSize?: () => LayoutSize
    }

    let width = 100
    let height = 100

    if (containerWithLayout.__getLayoutSize) {
      const size = containerWithLayout.__getLayoutSize()
      width = size.width
      height = size.height
    } else {
      const bounds = container.getBounds()
      width = bounds.width || 100
      height = bounds.height || 100
    }

    const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)

    const callbacks: GestureCallbacks = {}
    if (next.onTouch) callbacks.onTouch = next.onTouch
    if (next.onTouchMove) callbacks.onTouchMove = next.onTouchMove
    if (next.onDoubleTap) callbacks.onDoubleTap = next.onDoubleTap
    if (next.onLongPress) callbacks.onLongPress = next.onLongPress

    const config: { longPressDuration?: number; doubleTapDelay?: number } = {}
    if (next.longPressDuration !== undefined) config.longPressDuration = next.longPressDuration
    if (next.doubleTapDelay !== undefined) config.doubleTapDelay = next.doubleTapDelay

    manager.registerContainer(container, callbacks, hitArea, config)
    return
  }

  // Case 2: Gestures disabled or no callbacks
  if (prevEnabled && (!nextEnabled || !hasAnyGesture)) {
    manager.unregisterContainer(container)
    return
  }

  // Case 3: Gestures still enabled, update callbacks/hit area
  if (nextEnabled && hasAnyGesture) {
    // Update callbacks if any changed
    const callbacksChanged =
      prev.onTouch !== next.onTouch ||
      prev.onTouchMove !== next.onTouchMove ||
      prev.onDoubleTap !== next.onDoubleTap ||
      prev.onLongPress !== next.onLongPress

    if (callbacksChanged) {
      const callbacks: GestureCallbacks = {}
      if (next.onTouch) callbacks.onTouch = next.onTouch
      if (next.onTouchMove) callbacks.onTouchMove = next.onTouchMove
      if (next.onDoubleTap) callbacks.onDoubleTap = next.onDoubleTap
      if (next.onLongPress) callbacks.onLongPress = next.onLongPress

      manager.updateCallbacks(container, callbacks)
    }

    // Update hit area if width/height changed
    if (prev.width !== next.width || prev.height !== next.height) {
      // Use __getLayoutSize for actual calculated dimensions
      const containerWithLayout = container as typeof container & {
        __getLayoutSize?: () => LayoutSize
      }

      let width = 100
      let height = 100

      if (containerWithLayout.__getLayoutSize) {
        const size = containerWithLayout.__getLayoutSize()
        width = size.width
        height = size.height
      } else {
        const bounds = container.getBounds()
        width = bounds.width || 100
        height = bounds.height || 100
      }

      const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)

      manager.updateHitArea(container, hitArea)
    }
  }
}
