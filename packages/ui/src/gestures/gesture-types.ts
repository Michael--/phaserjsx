/**
 * Type definitions for the gesture system
 */
import type Phaser from 'phaser'

/**
 * Touch move gesture state
 */
export type TouchMoveState = 'start' | 'move' | 'end'

/**
 * Data passed to gesture event handlers
 */
export interface GestureEventData {
  /** The Phaser pointer that triggered the event */
  pointer: Phaser.Input.Pointer
  /** Local X coordinate relative to container origin (0,0) */
  localX: number
  /** Local Y coordinate relative to container origin (0,0) */
  localY: number
  /** Delta X since last move event (only for onTouchMove) */
  dx?: number
  /** Delta Y since last move event (only for onTouchMove) */
  dy?: number
  /** Width of the container's hit area */
  width: number
  /** Height of the container's hit area */
  height: number
  /** Whether pointer is currently inside the container hit area (only for onTouchMove) */
  isInside?: boolean
  /** Current state of touch move gesture: 'start' (first move), 'move' (during), 'end' (pointer up) (only for onTouchMove) */
  state?: TouchMoveState
}

/**
 * Callback functions for gesture events
 */
export interface GestureCallbacks {
  /** Called on pointer down + up on the same target (click/tap) */
  onTouch?: (data: GestureEventData) => void
  /** Called during pointer movement - continues even when outside bounds */
  onTouchMove?: (data: GestureEventData) => void
  /** Called when double tap/click is detected */
  onDoubleTap?: (data: GestureEventData) => void
  /** Called when pointer is held down for configured duration */
  onLongPress?: (data: GestureEventData) => void
}

/**
 * Configuration for gesture detection
 */
export interface GestureConfig {
  /** Duration in ms to trigger long press (default: 500) */
  longPressDuration?: number
  /** Max time in ms between taps for double tap (default: 300) */
  doubleTapDelay?: number
  /** Max time in ms for a valid touch/click (prevents delayed touch after long hold) (default: 500) */
  maxTouchDuration?: number
}

/**
 * Default gesture configuration values
 */
export const DEFAULT_GESTURE_CONFIG: Required<GestureConfig> = {
  longPressDuration: 500,
  doubleTapDelay: 300,
  maxTouchDuration: 500,
}

/**
 * Internal state for tracking a registered container
 */
export interface GestureContainerState {
  container: Phaser.GameObjects.Container
  callbacks: GestureCallbacks
  config: Required<GestureConfig>
  hitArea: Phaser.Geom.Rectangle

  // State for gesture detection
  lastTapTime?: number | undefined
  longPressTimer?: NodeJS.Timeout | undefined
  pointerDownPosition?: { x: number; y: number } | undefined
  pointerDownTime?: number | undefined
  longPressTriggered?: boolean | undefined
  isFirstMove?: boolean | undefined
}
