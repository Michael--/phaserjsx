/**
 * Tooltip system types
 * Provides tooltip configuration for any component via onTooltip callback
 */

/**
 * Tooltip position relative to target element
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

/**
 * Native Phaser animation configuration for tooltips
 */
export interface TooltipNativeAnimation {
  /** Fade in duration in ms (default: 200) */
  fadeIn?: number
  /** Fade out duration in ms (default: 200) */
  fadeOut?: number
  /** Move animation offset in pixels (default: { dx: 0, dy: 0 }) */
  move?: { dx?: number; dy?: number }
  /** Pulse/scale animation (default: false) */
  pulse?: boolean
  /** Scale range for pulse [from, to] (default: [0.75, 1.25]) */
  pulseScale?: [number, number]
}

/**
 * Tooltip configuration returned by onTooltip callback
 * Can be a simple string or full configuration object
 * Always renders as native Phaser text with animations (text only, no JSX)
 */
export interface TooltipConfig {
  /** Tooltip content (text only) */
  content: string

  /** Preferred position (auto-adjusted if out of bounds) */
  position?: TooltipPosition

  /** Delay before showing tooltip in ms */
  showDelay?: number

  /** Delay before hiding tooltip in ms */
  hideDelay?: number

  /** Offset from target in pixels */
  offset?: number

  /** Disabled state (tooltip won't show) */
  disabled?: boolean

  /** Auto-dismiss after duration in ms (independent of hover, 0 = no auto-dismiss) */
  autoDismiss?: number

  /** Animation configuration */
  animation?: TooltipNativeAnimation
}

/**
 * Tooltip callback function
 * Called when hover starts to determine tooltip configuration
 * Return null/undefined to disable tooltip
 * Return string as shortcut for { content: string }
 */
export type TooltipCallback = () => TooltipConfig | string | null | undefined
