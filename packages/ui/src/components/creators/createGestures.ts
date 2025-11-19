/**
 * Gesture setup for component initialization
 * Registers containers with the GestureManager for high-level gesture detection
 */
import Phaser from 'phaser'
import type { GestureProps, LayoutProps } from '../../core-props'
import { getGestureManager } from '../../gestures/gesture-manager'
import type { GestureCallbacks } from '../../gestures/gesture-types'

/**
 * Setup gesture tracking for container-based components
 * Only registers if enableGestures is true and at least one gesture callback exists
 * @param scene - Scene containing the gesture manager
 * @param container - Container to make gesture-aware
 * @param props - Props with gesture settings
 */
export function createGestures(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  props: Partial<GestureProps & LayoutProps>
): void {
  // Only register if explicitly enabled
  if (!props.enableGestures) {
    return
  }

  // Check if any gesture callback is defined
  const hasAnyGesture = !!(
    props.onTouch ||
    props.onTouchMove ||
    props.onDoubleTap ||
    props.onLongPress
  )

  if (!hasAnyGesture) {
    return
  }

  // Get scene's gesture manager
  const manager = getGestureManager(scene)

  // Calculate hit area (same logic as createInteraction for consistency)
  const width = typeof props.width === 'number' ? props.width : 100
  const height = typeof props.height === 'number' ? props.height : 100

  // Create hit area centered around container's origin
  // Phaser containers treat hit areas relative to their center
  const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)

  // Build callbacks object
  const callbacks: GestureCallbacks = {}
  if (props.onTouch) callbacks.onTouch = props.onTouch
  if (props.onTouchMove) callbacks.onTouchMove = props.onTouchMove
  if (props.onDoubleTap) callbacks.onDoubleTap = props.onDoubleTap
  if (props.onLongPress) callbacks.onLongPress = props.onLongPress

  // Build config (only include defined values)
  const config: { longPressDuration?: number; doubleTapDelay?: number } = {}
  if (props.longPressDuration !== undefined) config.longPressDuration = props.longPressDuration
  if (props.doubleTapDelay !== undefined) config.doubleTapDelay = props.doubleTapDelay

  // Register with manager
  manager.registerContainer(container, callbacks, hitArea, config)
}
