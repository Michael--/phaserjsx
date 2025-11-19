/**
 * Gesture property appliers for component patching
 * Updates gesture registration when props change
 */
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
  const prevEnabled = prev.enableGestures
  const nextEnabled = next.enableGestures

  const hasAnyGesture = !!(next.onTouch || next.onTouchMove || next.onDoubleTap || next.onLongPress)

  const manager = getGestureManager(scene)

  // Case 1: Gestures newly enabled
  if (!prevEnabled && nextEnabled && hasAnyGesture) {
    // Register for the first time
    const width = typeof next.width === 'number' ? next.width : 100
    const height = typeof next.height === 'number' ? next.height : 100
    const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height)

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
      const width = typeof next.width === 'number' ? next.width : 100
      const height = typeof next.height === 'number' ? next.height : 100
      const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height)

      manager.updateHitArea(container, hitArea)
    }
  }
}
