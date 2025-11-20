/**
 * Helper functions for color system integration with theme
 */
import type { ColorTokens } from './color-types'
import { alpha } from './color-utils'

/**
 * Convert ColorTokens to a theme-compatible object
 * Maps semantic color names to Phaser number format for View/Button components
 * @param colors - ColorTokens to convert
 * @returns Object with backgroundColor, borderColor, etc.
 * @example
 * ```typescript
 * const colors = getPreset('oceanBlue').colors
 * const buttonTheme = {
 *   ...colorsToTheme(colors, 'primary'),
 *   padding: 8,
 * }
 * // Returns: { backgroundColor: 0x2196f3, borderColor: 0x... }
 * ```
 */
export function colorsToTheme(
  colors: ColorTokens,
  colorKey: keyof Pick<
    ColorTokens,
    'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info'
  >,
  options: {
    /** Which shade to use for background (default: 'DEFAULT') */
    backgroundShade?: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT'
    /** Which shade to use for border (default: 'dark') */
    borderShade?: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT'
    /** Include border color (default: true) */
    includeBorder?: boolean
  } = {}
): {
  backgroundColor: number
  borderColor?: number
} {
  const { backgroundShade = 'DEFAULT', borderShade = 'dark', includeBorder = true } = options

  const result: { backgroundColor: number; borderColor?: number } = {
    backgroundColor: colors[colorKey][backgroundShade],
  }

  if (includeBorder) {
    result.borderColor = colors[colorKey][borderShade]
  }

  return result
}

/**
 * Get text color from ColorTokens as hex string for Phaser Text style
 * @param colors - ColorTokens to use
 * @param shade - Which text shade to use (default: 'DEFAULT')
 * @param alphaValue - Optional alpha value (0-1)
 * @returns Hex string or rgba string for Text style
 * @example
 * ```typescript
 * const colors = getPreset('oceanBlue').colors
 * const textStyle = {
 *   color: getTextColor(colors),
 *   fontSize: '18px'
 * }
 * ```
 */
export function getTextColor(
  colors: ColorTokens,
  shade: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT' = 'DEFAULT',
  alphaValue?: number
): string {
  const color = colors.text[shade]
  return alphaValue !== undefined
    ? alpha(color, alphaValue)
    : `#${color.toString(16).padStart(6, '0')}`
}

/**
 * Get background color from ColorTokens
 * @param colors - ColorTokens to use
 * @param shade - Which shade to use (default: 'DEFAULT')
 * @returns Phaser color number
 */
export function getBackgroundColor(
  colors: ColorTokens,
  shade: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT' = 'DEFAULT'
): number {
  return colors.background[shade]
}

/**
 * Get surface color from ColorTokens
 * @param colors - ColorTokens to use
 * @param shade - Which shade to use (default: 'DEFAULT')
 * @returns Phaser color number
 */
export function getSurfaceColor(
  colors: ColorTokens,
  shade: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT' = 'DEFAULT'
): number {
  return colors.surface[shade]
}

/**
 * Get border color from ColorTokens
 * @param colors - ColorTokens to use
 * @param shade - Which shade to use (default: 'DEFAULT')
 * @returns Phaser color number
 */
export function getBorderColor(
  colors: ColorTokens,
  shade: 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT' = 'DEFAULT'
): number {
  return colors.border[shade]
}
