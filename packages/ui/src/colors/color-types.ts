/**
 * Color system types for PhaserJSX UI
 * Provides semantic color tokens with named shade levels
 */

/**
 * Named shade levels for color scales
 * Uses semantic names instead of numeric values
 */
export type ShadeLevel = 'lightest' | 'light' | 'medium' | 'dark' | 'darkest' | 'DEFAULT'

/**
 * Color shade scale with semantic naming
 * Each color token has multiple shades for different use cases
 * @example
 * ```typescript
 * const primaryShade: ColorShade = {
 *   lightest: 0xe3f2fd,
 *   light: 0x90caf9,
 *   medium: 0x42a5f5,
 *   dark: 0x1976d2,
 *   darkest: 0x0d47a1,
 *   DEFAULT: 0x2196f3
 * }
 * ```
 */
export interface ColorShade {
  /** Lightest shade - backgrounds, hover states */
  lightest: number
  /** Light shade - secondary elements */
  light: number
  /** Medium shade - interactive elements */
  medium: number
  /** Dark shade - borders, dividers */
  dark: number
  /** Darkest shade - text, emphasis */
  darkest: number
  /** Default shade - primary usage */
  DEFAULT: number
}

/**
 * Complete color token system with semantic color categories
 * Designed for global theme usage with nested theme support
 */
export interface ColorTokens {
  /** Primary brand color - main actions and emphasis */
  primary: ColorShade
  /** Secondary brand color - supporting actions */
  secondary: ColorShade
  /** Accent color - highlights and special elements */
  accent: ColorShade

  /** Success state color - confirmations, positive feedback */
  success: ColorShade
  /** Warning state color - cautions, alerts */
  warning: ColorShade
  /** Error state color - errors, destructive actions */
  error: ColorShade
  /** Info state color - informational messages */
  info: ColorShade

  /** Background colors - main app backgrounds */
  background: ColorShade
  /** Surface colors - cards, panels, elevated elements */
  surface: ColorShade
  /** Text colors - typography hierarchy */
  text: ColorShade
  /** Border colors - dividers, outlines */
  border: ColorShade
}

/**
 * Color mode enum for light/dark theme switching
 */
export type ColorMode = 'light' | 'dark'

/**
 * RGB color representation
 */
export interface RGBColor {
  r: number
  g: number
  b: number
}
