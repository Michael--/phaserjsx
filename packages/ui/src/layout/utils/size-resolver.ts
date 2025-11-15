/**
 * Size resolution utilities for handling different size value types
 * Supports fixed pixels, percentages, and auto sizing
 */
import type { ParsedSize } from '../types'

// Re-export for convenience
export type { ParsedSize } from '../types'

/**
 * Parse a size value into its components
 * @param size - Size value (number, string, or undefined)
 * @returns Parsed size information
 * @throws Error if string format is invalid
 *
 * @example
 * parseSize(100)      // { type: 'fixed', value: 100 }
 * parseSize('50%')    // { type: 'percent', value: 50 }
 * parseSize(undefined) // { type: 'auto' }
 * parseSize('auto')   // { type: 'auto' }
 */
export function parseSize(size: number | string | undefined): ParsedSize {
  // undefined -> auto (dynamic based on content)
  if (size === undefined) {
    return { type: 'auto' }
  }

  // number -> fixed pixel value
  if (typeof size === 'number') {
    return { type: 'fixed', value: size }
  }

  // string -> parse format
  if (size === 'auto') {
    return { type: 'auto' }
  }

  // Percentage format: "50%", "75.5%", "100%"
  const percentMatch = size.match(/^(\d+(?:\.\d+)?)%$/)
  if (percentMatch && percentMatch[1]) {
    const value = parseFloat(percentMatch[1])
    if (value < 0 || value > 100) {
      console.warn(`[Size] Percentage value ${value}% is outside valid range (0-100%)`)
    }
    return { type: 'percent', value }
  }

  // Unknown format
  throw new Error(
    `[Size] Invalid size format: "${size}". Supported formats: number, "X%", "auto", undefined`
  )
}

/**
 * Resolve a parsed size to actual pixel value
 * @param parsed - Parsed size information
 * @param parentSize - Parent dimension in pixels (required for percentage)
 * @param contentSize - Content dimension in pixels (fallback for auto)
 * @returns Resolved size in pixels
 *
 * @example
 * resolveSize({ type: 'fixed', value: 100 }, 200)         // 100
 * resolveSize({ type: 'percent', value: 50 }, 200)        // 100 (50% of 200)
 * resolveSize({ type: 'auto' }, 200, 150)                 // 150 (content size)
 * resolveSize({ type: 'percent', value: 75 }, undefined)  // Error: no parent
 */
export function resolveSize(parsed: ParsedSize, parentSize?: number, contentSize?: number): number {
  switch (parsed.type) {
    case 'fixed':
      return parsed.value ?? 100

    case 'percent':
      if (parentSize === undefined) {
        console.warn(
          `[Size] Cannot resolve percentage without parent size. Using content size or fallback.`
        )
        return contentSize ?? 100
      }
      return (parentSize * (parsed.value ?? 0)) / 100

    case 'auto':
      if (contentSize === undefined) {
        console.warn('[Size] Auto size without content size, using fallback 100px')
        return 100
      }
      return contentSize

    default:
      // Should never happen with proper typing
      console.error(`[Size] Unknown size type: ${(parsed as ParsedSize).type}`)
      return 100
  }
}

/**
 * Check if a size needs parent context to resolve
 * @param parsed - Parsed size information
 * @returns True if size requires parent dimension
 */
export function requiresParent(parsed: ParsedSize): boolean {
  return parsed.type === 'percent'
}

/**
 * Check if a size can be determined without content measurement
 * @param parsed - Parsed size information
 * @returns True if size is explicitly defined (not auto)
 */
export function isExplicit(parsed: ParsedSize): boolean {
  return parsed.type === 'fixed' || parsed.type === 'percent'
}
