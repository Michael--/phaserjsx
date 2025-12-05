/**
 * Gesture setup for component initialization
 * Registers containers with the GestureManager for high-level gesture detection
 */
import type { LayoutSize } from '@phaserjsx/ui/layout/types'
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
  // Check if any gesture callback is defined
  const hasAnyGesture = !!(
    props.onTouch ||
    props.onTouchOutside ||
    props.onTouchMove ||
    props.onDoubleTap ||
    props.onLongPress ||
    props.onHoverStart ||
    props.onHoverEnd ||
    props.onWheel
  )

  // Auto-enable gestures if callbacks are provided, unless explicitly disabled
  const shouldEnable = hasAnyGesture && props.enableGestures !== false

  if (!shouldEnable) {
    return
  }

  // Get scene's gesture manager
  const manager = getGestureManager(scene)

  // Get actual calculated container size from layout system
  // Use __getLayoutSize if available (set by createLayout), otherwise fallback to getBounds
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
    // Fallback to getBounds if __getLayoutSize not available yet
    const bounds = container.getBounds()
    width = bounds.width || 100
    height = bounds.height || 100
  }

  // Create hit area with origin at (0,0) - matches our component system
  const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height)

  // Build callbacks object
  const callbacks: GestureCallbacks = {}
  if (props.onTouch) callbacks.onTouch = props.onTouch
  if (props.onTouchOutside) callbacks.onTouchOutside = props.onTouchOutside
  if (props.onTouchMove) callbacks.onTouchMove = props.onTouchMove
  if (props.onDoubleTap) callbacks.onDoubleTap = props.onDoubleTap
  if (props.onLongPress) callbacks.onLongPress = props.onLongPress
  if (props.onHoverStart) callbacks.onHoverStart = props.onHoverStart
  if (props.onHoverEnd) callbacks.onHoverEnd = props.onHoverEnd
  if (props.onWheel) callbacks.onWheel = props.onWheel

  // Build config (only include defined values)
  const config: { longPressDuration?: number; doubleTapDelay?: number; maxTouchDuration?: number } =
    {}
  if (props.longPressDuration !== undefined) config.longPressDuration = props.longPressDuration
  if (props.doubleTapDelay !== undefined) config.doubleTapDelay = props.doubleTapDelay
  if (props.maxTouchDuration !== undefined) config.maxTouchDuration = props.maxTouchDuration

  // Register with manager
  manager.registerContainer(container, callbacks, hitArea, config)
}
