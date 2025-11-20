/**
 * Color utility functions for PhaserJSX UI
 * Provides conversion between formats and color manipulation
 */

import type { RGBColor } from './color-types'

/**
 * Convert hex string to Phaser number format
 * @param hex - Hex color string (e.g., '#ffffff' or 'ffffff')
 * @returns Phaser color number (e.g., 0xffffff)
 * @example
 * ```typescript
 * hexToNumber('#ff0000') // returns 0xff0000
 * hexToNumber('00ff00')  // returns 0x00ff00
 * ```
 */
export function hexToNumber(hex: string): number {
  const cleaned = hex.replace('#', '')
  return parseInt(cleaned, 16)
}

/**
 * Convert Phaser number format to hex string
 * @param num - Phaser color number (e.g., 0xffffff)
 * @param withHash - Include '#' prefix (default: true)
 * @returns Hex color string (e.g., '#ffffff')
 * @example
 * ```typescript
 * numberToHex(0xff0000)        // returns '#ff0000'
 * numberToHex(0x00ff00, false) // returns '00ff00'
 * ```
 */
export function numberToHex(num: number, withHash = true): string {
  const hex = num.toString(16).padStart(6, '0')
  return withHash ? `#${hex}` : hex
}

/**
 * Convert RGB values to Phaser number format
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Phaser color number
 * @example
 * ```typescript
 * rgbToNumber(255, 0, 0)     // returns 0xff0000 (red)
 * rgbToNumber(0, 255, 0)     // returns 0x00ff00 (green)
 * rgbToNumber(255, 255, 255) // returns 0xffffff (white)
 * ```
 */
export function rgbToNumber(r: number, g: number, b: number): number {
  return ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
}

/**
 * Convert Phaser number to RGB components
 * @param num - Phaser color number
 * @returns RGB color object
 * @example
 * ```typescript
 * numberToRgb(0xff0000) // returns { r: 255, g: 0, b: 0 }
 * numberToRgb(0x00ff00) // returns { r: 0, g: 255, b: 0 }
 * ```
 */
export function numberToRgb(num: number): RGBColor {
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  }
}

/**
 * Lighten a color by a given amount
 * @param color - Phaser color number
 * @param amount - Amount to lighten (0.0 to 1.0, where 1.0 is white)
 * @returns Lightened color number
 * @example
 * ```typescript
 * lighten(0x0000ff, 0.3) // returns lighter blue
 * lighten(0xff0000, 0.5) // returns light red/pink
 * ```
 */
export function lighten(color: number, amount: number): number {
  const rgb = numberToRgb(color)
  const factor = Math.max(0, Math.min(1, amount))

  const r = Math.round(rgb.r + (255 - rgb.r) * factor)
  const g = Math.round(rgb.g + (255 - rgb.g) * factor)
  const b = Math.round(rgb.b + (255 - rgb.b) * factor)

  return rgbToNumber(r, g, b)
}

/**
 * Darken a color by a given amount
 * @param color - Phaser color number
 * @param amount - Amount to darken (0.0 to 1.0, where 1.0 is black)
 * @returns Darkened color number
 * @example
 * ```typescript
 * darken(0x0000ff, 0.3) // returns darker blue
 * darken(0xff0000, 0.5) // returns dark red
 * ```
 */
export function darken(color: number, amount: number): number {
  const rgb = numberToRgb(color)
  const factor = 1 - Math.max(0, Math.min(1, amount))

  const r = Math.round(rgb.r * factor)
  const g = Math.round(rgb.g * factor)
  const b = Math.round(rgb.b * factor)

  return rgbToNumber(r, g, b)
}

/**
 * Lighten a hex color by a given amount
 * @param hex - Hex color string (e.g., '#ffffff' or 'ffffff')
 * @param amount - Amount to lighten (0.0 to 1.0, where 1.0 is white)
 * @returns Lightened hex color string with '#' prefix
 * @example
 * ```typescript
 * lightenHex('#0000ff', 0.3) // returns lighter blue
 * lightenHex('#ff0000', 0.5) // returns light red/pink
 * ```
 */
export function lightenHex(hex: string, amount: number): string {
  const num = hexToNumber(hex)
  const lightened = lighten(num, amount)
  return numberToHex(lightened)
}

/**
 * Darken a hex color by a given amount
 * @param hex - Hex color string (e.g., '#ffffff' or 'ffffff')
 * @param amount - Amount to darken (0.0 to 1.0, where 1.0 is black)
 * @returns Darkened hex color string with '#' prefix
 * @example
 * ```typescript
 * darkenHex('#0000ff', 0.3) // returns darker blue
 * darkenHex('#ff0000', 0.5) // returns dark red
 * ```
 */
export function darkenHex(hex: string, amount: number): string {
  const num = hexToNumber(hex)
  const darkened = darken(num, amount)
  return numberToHex(darkened)
}

/**
 * Hex color wrapper with chainable conversion methods
 * Provides fluent API for color conversions
 */
export interface HexColorWrapper {
  /** Original hex string value */
  value: string
  /** Convert to Phaser number format */
  toNumber: () => number
  /** Convert to string (returns hex) */
  toString: () => string
}

/**
 * Create a hex color wrapper with chainable methods
 * @param hex - Hex color string
 * @returns Wrapper object with conversion methods
 * @example
 * ```typescript
 * const color = hex('#ff0000')
 * color.toNumber()  // 0xff0000
 * color.toString()  // '#ff0000'
 *
 * // Direct usage:
 * backgroundColor: hex(colors.primary.DEFAULT).toNumber()
 * ```
 */
export function hex(hexColor: string): HexColorWrapper {
  return {
    value: hexColor,
    toNumber: () => hexToNumber(hexColor),
    toString: () => hexColor,
  }
}

/**
 * Convert color to rgba string for Phaser Text style
 * @param color - Phaser color number
 * @param alphaValue - Alpha value (0.0 to 1.0, default: 1.0)
 * @returns RGBA string usable in Text style (e.g., 'rgba(255, 0, 0, 0.5)')
 * @example
 * ```typescript
 * alpha(0xff0000, 1.0)   // returns 'rgba(255, 0, 0, 1)'
 * alpha(0x00ff00, 0.5)   // returns 'rgba(0, 255, 0, 0.5)'
 * alpha(0x0000ff)        // returns 'rgba(0, 0, 255, 1)'
 * ```
 */
export function alpha(color: number, alphaValue = 1.0): string {
  const rgb = numberToRgb(color)
  const a = Math.max(0, Math.min(1, alphaValue))
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
}

/**
 * Calculate relative luminance of a color (WCAG formula)
 * @param color - Phaser color number
 * @returns Relative luminance (0.0 to 1.0)
 */
function getLuminance(color: number): number {
  const rgb = numberToRgb(color)

  // Convert to sRGB
  const rsRGB = rgb.r / 255
  const gsRGB = rgb.g / 255
  const bsRGB = rgb.b / 255

  // Apply gamma correction
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.0)
 * @param foreground - Foreground color (e.g., text)
 * @param background - Background color
 * @returns Contrast ratio (1 to 21)
 * @example
 * ```typescript
 * getContrastRatio(0x000000, 0xffffff) // returns 21 (black on white)
 * getContrastRatio(0xffffff, 0xffffff) // returns 1 (white on white)
 * ```
 */
export function getContrastRatio(foreground: number, background: number): number {
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Ensure minimum contrast ratio by adjusting foreground color
 * @param foreground - Foreground color to adjust
 * @param background - Background color (fixed)
 * @param minRatio - Minimum contrast ratio (default: 4.5 for WCAG AA)
 * @returns Adjusted foreground color meeting contrast requirements
 * @example
 * ```typescript
 * // Ensure text is readable on background
 * const textColor = ensureContrast(0x888888, 0xffffff, 4.5)
 * ```
 */
export function ensureContrast(foreground: number, background: number, minRatio = 4.5): number {
  let adjusted = foreground
  let ratio = getContrastRatio(adjusted, background)

  // If contrast is already sufficient, return original
  if (ratio >= minRatio) {
    return foreground
  }

  // Determine if we should lighten or darken
  const bgLuminance = getLuminance(background)
  const shouldLighten = bgLuminance < 0.5

  // Adjust in steps until we meet minimum ratio
  let step = 0.1
  while (ratio < minRatio && step <= 1.0) {
    adjusted = shouldLighten ? lighten(foreground, step) : darken(foreground, step)
    ratio = getContrastRatio(adjusted, background)
    step += 0.1
  }

  return adjusted
}
