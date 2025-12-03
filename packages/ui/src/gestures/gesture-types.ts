/**
 * Type definitions for the gesture system
 */
import type Phaser from 'phaser'

/**
 * Touch move gesture state
 */
export type TouchMoveState = 'start' | 'move' | 'end'

/**
 * Data passed to keyboard event handlers
 */
export interface KeyboardEventData {
  /** The original DOM keyboard event */
  event: KeyboardEvent
  /** The key value of the key represented by the event */
  key: string
  /** The code value of the physical key */
  code: string
  /** Whether the Alt key was pressed */
  altKey: boolean
  /** Whether the Ctrl key was pressed */
  ctrlKey: boolean
  /** Whether the Shift key was pressed */
  shiftKey: boolean
  /** Whether the Meta key (Cmd/Win) was pressed */
  metaKey: boolean
  /** Whether this is a repeat event (key held down) */
  repeat: boolean

  /**
   * Prevent default browser behavior
   */
  preventDefault(): void

  /**
   * Stop event propagation
   */
  stopPropagation(): void
}

/**
 * Data passed to input event handlers
 */
export interface InputEventData {
  /** The current value of the input */
  value: string
  /** The original DOM input event */
  event: Event

  /**
   * Prevent default browser behavior
   */
  preventDefault(): void

  /**
   * Stop event propagation
   */
  stopPropagation(): void
}

/**
 * Data passed to focus/blur event handlers
 */
export interface FocusEventData {
  /** The original DOM focus event */
  event: FocusEvent

  /**
   * Prevent default browser behavior
   */
  preventDefault(): void

  /**
   * Stop event propagation
   */
  stopPropagation(): void
}

/**
 * Data passed to hover event handlers (desktop/mouse only)
 */
export interface HoverEventData {
  /** The Phaser pointer that triggered the event */
  pointer: Phaser.Input.Pointer
  /** Local X coordinate relative to container origin (0,0) */
  localX: number
  /** Local Y coordinate relative to container origin (0,0) */
  localY: number
  /** Width of the container's hit area */
  width: number
  /** Height of the container's hit area */
  height: number

  /**
   * Stop event propagation to parent containers
   */
  stopPropagation(): void

  /**
   * Check if propagation has been stopped
   * @returns true if stopPropagation() was called
   */
  isPropagationStopped(): boolean
}

/**
 * Data passed to gesture event handlers
 * Supports DOM-style event propagation control
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
  /** Whether pointer is currently inside the container hit area */
  isInside?: boolean
  /** Current state of touch move gesture: 'start' (first move), 'move' (during), 'end' (pointer up) (only for onTouchMove) */
  state?: TouchMoveState

  /**
   * Stop event propagation to parent containers
   * Similar to DOM's event.stopPropagation()
   * Default behavior: events bubble up to parent containers
   */
  stopPropagation(): void

  /**
   * Check if propagation has been stopped
   * @returns true if stopPropagation() was called
   */
  isPropagationStopped(): boolean
}

/**
 * Callback functions for gesture events
 */
export interface GestureCallbacks {
  /** Called on pointer down + up on the same target (click/tap) */
  onTouch?: (data: GestureEventData) => void
  /** Called when pointer up occurs outside the container (for click-outside detection) */
  onTouchOutside?: (data: GestureEventData) => void
  /** Called during pointer movement - continues even when outside bounds */
  onTouchMove?: (data: GestureEventData) => void
  /** Called when double tap/click is detected */
  onDoubleTap?: (data: GestureEventData) => void
  /** Called when pointer is held down for configured duration */
  onLongPress?: (data: GestureEventData) => void
  /** Called when a key is pressed down */
  onKeyDown?: (data: KeyboardEventData) => void
  /** Called when a key is released */
  onKeyUp?: (data: KeyboardEventData) => void
  /** Called when input value changes */
  onInput?: (data: InputEventData) => void
  /** Called when element receives focus */
  onFocus?: (data: FocusEventData) => void
  /** Called when element loses focus */
  onBlur?: (data: FocusEventData) => void
  /** Called when pointer enters the container (desktop/mouse only) */
  onHoverStart?: (data: HoverEventData) => void
  /** Called when pointer exits the container (desktop/mouse only) */
  onHoverEnd?: (data: HoverEventData) => void
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
  mountRootId?: number | undefined // Root ID from mountJSX to isolate different mount trees

  // State for gesture detection
  lastTapTime?: number | undefined
  longPressTimer?: NodeJS.Timeout | undefined
  pointerDownPosition?: { x: number; y: number } | undefined
  pointerDownTime?: number | undefined
  longPressTriggered?: boolean | undefined
  isFirstMove?: boolean | undefined
}
