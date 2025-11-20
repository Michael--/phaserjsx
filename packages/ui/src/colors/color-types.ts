/**
 * Color system types for PhaserJSX UI
 * Provides semantic color tokens with named shade levels
 */

/**
 * Named shade levels for color scales
 * Uses semantic names instead of numeric values
 */
export type ShadeLevel = 'lightest' | 'light' | 'medium' | 'dark' | 'darkest'

/**
 * Hex color string with conversion method
 * Extends string but adds toNumber() for Phaser compatibility
 */
export class HexColor extends String {
  /**
   * Convert to Phaser number format
   * @returns Color as number (0xffffff)
   */
  toNumber(): number {
    const hex = this.valueOf().replace('#', '')
    return parseInt(hex, 16)
  }

  /**
   * Create a HexColor from a hex string
   * @param hex - Hex color string
   */
  static from(hex: string): HexColor {
    return new HexColor(hex) as HexColor
  }
}

/**
 * Color shade scale with semantic naming
 * Each color token has multiple shades for different use cases
 * Uses HexColor type for VS Code color picker support and .toNumber() method
 * DEFAULT is computed property pointing to medium (not in interface)
 * @example
 * ```typescript
 * const primaryShade: ColorShade = {
 *   lightest: HexColor.from('#e3f2fd'),
 *   light: HexColor.from('#90caf9'),
 *   medium: HexColor.from('#42a5f5'),
 *   dark: HexColor.from('#1976d2'),
 *   darkest: HexColor.from('#0d47a1'),
 * }
 * // DEFAULT is available via getter:
 * backgroundColor: colors.primary.DEFAULT.toNumber() // returns medium
 * // Direct usage:
 * backgroundColor: colors.primary.medium.toNumber()
 * ```
 */
export interface ColorShade {
  /** Lightest shade - backgrounds, hover states */
  lightest: HexColor
  /** Light shade - secondary elements */
  light: HexColor
  /** Medium shade - interactive elements (also available as DEFAULT) */
  medium: HexColor
  /** Dark shade - borders, dividers */
  dark: HexColor
  /** Darkest shade - text, emphasis */
  darkest: HexColor
  /** DEFAULT shade - computed property that points to medium */
  readonly DEFAULT: HexColor
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
