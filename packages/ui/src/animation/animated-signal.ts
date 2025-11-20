/**
 * Signal-based animation utilities
 * Provides reactive signals that trigger direct DOM updates without VDOM traversal
 */
import { signal, type Signal } from '@preact/signals-core'

/**
 * Animated signal that holds a numeric value
 * Can be used in JSX props for direct updates without VDOM
 */
export interface AnimatedSignal extends Signal<number> {
  /** Mark as animated signal for VDOM detection */
  __isAnimated: true
}

/**
 * Creates an animated signal
 * @param initialValue - Initial numeric value
 * @returns Animated signal
 */
export function animatedSignal(initialValue: number): AnimatedSignal {
  const sig = signal(initialValue) as AnimatedSignal
  sig.__isAnimated = true
  return sig
}

/**
 * Type guard to check if value is an animated signal
 * @param value - Value to check
 * @returns True if value is an animated signal
 */
export function isAnimatedSignal(value: unknown): value is AnimatedSignal {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__isAnimated' in value &&
    (value as AnimatedSignal).__isAnimated === true
  )
}

/**
 * Unwraps signal value or returns raw value
 * Type-safe overloads ensure correct return types
 * @param value - Signal or raw value
 * @returns Unwrapped value
 */
function unwrapSignal(value: AnimatedSignal): number
function unwrapSignal(value: number): number
function unwrapSignal(value: string): string
function unwrapSignal(value: number | AnimatedSignal): number
function unwrapSignal(value: string | AnimatedSignal): string | number
function unwrapSignal(value: number | string | AnimatedSignal): number | string
function unwrapSignal(
  value: number | string | AnimatedSignal | undefined
): number | string | undefined {
  if (value === undefined) return undefined
  return isAnimatedSignal(value) ? value.value : value
}

export { unwrapSignal }
