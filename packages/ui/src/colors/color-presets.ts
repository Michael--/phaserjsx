/**
 * Color preset definitions for PhaserJSX UI
 * Provides pre-configured color palettes with light/dark mode support
 */

import { HexColor, type ColorShade, type ColorTokens } from './color-types'
import { hexToNumber, hslToNumber, numberToHex, numberToHsl } from './color-utils'

/**
 * Base ColorShade without DEFAULT property
 */
type ColorShadeBase = Omit<ColorShade, 'DEFAULT'>

/** Neutral color hex values per shade level */
type NeutralHexValues = Record<'lightest' | 'light' | 'medium' | 'dark' | 'darkest', string>

/** Light mode neutral color definitions */
const LIGHT_NEUTRALS = {
  background: {
    lightest: '#ffffff',
    light: '#f5f5f5',
    medium: '#e0e0e0',
    dark: '#bdbdbd',
    darkest: '#9e9e9e',
  },
  surface: {
    lightest: '#ffffff',
    light: '#f5f5f5',
    medium: '#eeeeee',
    dark: '#e0e0e0',
    darkest: '#bdbdbd',
  },
  text: {
    lightest: '#9e9e9e',
    light: '#757575',
    medium: '#616161',
    dark: '#424242',
    darkest: '#212121',
  },
  border: {
    lightest: '#e0e0e0',
    light: '#bdbdbd',
    medium: '#9e9e9e',
    dark: '#757575',
    darkest: '#424242',
  },
} as const satisfies Record<string, NeutralHexValues>

/** Dark mode neutral color definitions */
const DARK_NEUTRALS = {
  background: {
    lightest: '#424242',
    light: '#303030',
    medium: '#212121',
    dark: '#1a1a1a',
    darkest: '#0a0a0a',
  },
  surface: {
    lightest: '#424242',
    light: '#303030',
    medium: '#262626',
    dark: '#1e1e1e',
    darkest: '#121212',
  },
  text: {
    lightest: '#ffffff',
    light: '#e0e0e0',
    medium: '#bdbdbd',
    dark: '#9e9e9e',
    darkest: '#757575',
  },
  border: {
    lightest: '#616161',
    light: '#424242',
    medium: '#303030',
    dark: '#212121',
    darkest: '#1a1a1a',
  },
} as const satisfies Record<string, NeutralHexValues>

/**
 * Convert neutral hex values to a full ColorShade with DEFAULT alias
 * @param shades - Record of shade level to hex string
 * @returns ColorShade with HexColor instances and DEFAULT pointing to medium
 */
function toColorShade(shades: NeutralHexValues): ColorShade {
  return {
    lightest: HexColor.from(shades.lightest),
    light: HexColor.from(shades.light),
    medium: HexColor.from(shades.medium),
    dark: HexColor.from(shades.dark),
    darkest: HexColor.from(shades.darkest),
    DEFAULT: HexColor.from(shades.medium),
  }
}

/**
 * Create a ColorShade with DEFAULT pointing to medium
 * @param shade - ColorShade object without DEFAULT
 * @returns ColorShade with DEFAULT set to medium
 */
function addDefault(shade: ColorShadeBase): ColorShade {
  return { ...shade, DEFAULT: shade.medium }
}

/**
 * Generate a complete color scale from a base color using HSL-based perceptual scaling
 * Creates shades from lightest to darkest with DEFAULT pointing to medium
 * @param baseColor - The base color in hex format (e.g., '#2196f3')
 * @returns Complete ColorShade with all semantic levels as HexColor objects
 * @example
 * ```typescript
 * const primaryScale = generateColorScale('#2196f3')
 * // Usage: colors.primary.medium.toNumber()
 * // DEFAULT also works: colors.primary.DEFAULT.toNumber()
 * ```
 */
export function generateColorScale(baseColor: string): ColorShade {
  const num = hexToNumber(baseColor)
  const hsl = numberToHsl(num)

  return addDefault({
    lightest: HexColor.from(numberToHex(hslToNumber(hsl.h, hsl.s, 0.92))),
    light: HexColor.from(numberToHex(hslToNumber(hsl.h, hsl.s * 0.7, 0.72))),
    medium: HexColor.from(baseColor),
    dark: HexColor.from(numberToHex(hslToNumber(hsl.h, hsl.s * 0.8, 0.35))),
    darkest: HexColor.from(numberToHex(hslToNumber(hsl.h, hsl.s * 0.6, 0.15))),
  })
}

/**
 * Color preset configuration
 * Defines a complete set of semantic colors for a theme
 */
export interface ColorPreset {
  /** Preset name for identification */
  name: string
  /** Complete color token set */
  colors: ColorTokens
}

/**
 * Ocean Blue Preset
 * Clean, professional blue-based palette
 */
export const oceanBluePreset: ColorPreset = {
  name: 'oceanBlue',
  colors: {
    // Brand colors
    primary: generateColorScale('#2196f3'), // Material Blue
    secondary: generateColorScale('#607d8b'), // Blue Grey
    accent: generateColorScale('#00bcd4'), // Cyan

    // Feedback colors
    success: generateColorScale('#4caf50'), // Green
    warning: generateColorScale('#ff9800'), // Orange
    error: generateColorScale('#f44336'), // Red
    info: generateColorScale('#2196f3'), // Blue (same as primary)

    // Neutral colors - designed for light mode
    background: toColorShade(LIGHT_NEUTRALS.background),
    surface: toColorShade(LIGHT_NEUTRALS.surface),
    text: toColorShade(LIGHT_NEUTRALS.text),
    border: toColorShade(LIGHT_NEUTRALS.border),
  },
}

/**
 * Forest Green Preset
 * Nature-inspired green-based palette
 */
export const forestGreenPreset: ColorPreset = {
  name: 'forestGreen',
  colors: {
    // Brand colors
    primary: generateColorScale('#4caf50'), // Green
    secondary: generateColorScale('#8bc34a'), // Light Green
    accent: generateColorScale('#ffeb3b'), // Yellow

    // Feedback colors
    success: generateColorScale('#66bb6a'), // Light Green
    warning: generateColorScale('#ffa726'), // Orange
    error: generateColorScale('#ef5350'), // Red
    info: generateColorScale('#29b6f6'), // Light Blue

    // Neutral colors - green-tinted
    background: toColorShade({
      lightest: '#ffffff',
      light: '#f1f8e9',
      medium: '#dcedc8',
      dark: '#c5e1a5',
      darkest: '#aed581',
    }),
    surface: toColorShade({
      lightest: '#ffffff',
      light: '#f9fbe7',
      medium: '#f0f4c3',
      dark: '#e6ee9c',
      darkest: '#dce775',
    }),
    text: toColorShade({
      lightest: '#9e9e9e',
      light: '#757575',
      medium: '#616161',
      dark: '#424242',
      darkest: '#1b5e20',
    }),
    border: toColorShade({
      lightest: '#dcedc8',
      light: '#c5e1a5',
      medium: '#aed581',
      dark: '#9ccc65',
      darkest: '#7cb342',
    }),
  },
}

/**
 * Midnight Preset
 * Dark, elegant purple-based palette
 */
export const midnightPreset: ColorPreset = {
  name: 'midnight',
  colors: {
    // Brand colors
    primary: generateColorScale('#9c27b0'), // Purple
    secondary: generateColorScale('#673ab7'), // Deep Purple
    accent: generateColorScale('#e91e63'), // Pink

    // Feedback colors
    success: generateColorScale('#66bb6a'), // Green
    warning: generateColorScale('#ffa726'), // Orange
    error: generateColorScale('#ef5350'), // Red
    info: generateColorScale('#42a5f5'), // Blue

    // Neutral colors - designed for dark mode
    background: toColorShade(DARK_NEUTRALS.background),
    surface: toColorShade(DARK_NEUTRALS.surface),
    text: toColorShade(DARK_NEUTRALS.text),
    border: toColorShade(DARK_NEUTRALS.border),
  },
}

/**
 * Apply light mode overrides to a preset
 * Adjusts neutral colors for optimal light mode appearance
 * @param preset - Base preset to modify
 * @returns New preset with light mode neutral colors
 */
export function applyLightMode(preset: ColorPreset): ColorPreset {
  return {
    ...preset,
    colors: {
      ...preset.colors,
      background: toColorShade(LIGHT_NEUTRALS.background),
      surface: toColorShade(LIGHT_NEUTRALS.surface),
      text: toColorShade(LIGHT_NEUTRALS.text),
      border: toColorShade(LIGHT_NEUTRALS.border),
    },
  }
}

/**
 * Apply dark mode overrides to a preset
 * Adjusts neutral colors for optimal dark mode appearance
 * @param preset - Base preset to modify
 * @returns New preset with dark mode neutral colors
 */
export function applyDarkMode(preset: ColorPreset): ColorPreset {
  return {
    ...preset,
    colors: {
      ...preset.colors,
      background: toColorShade(DARK_NEUTRALS.background),
      surface: toColorShade(DARK_NEUTRALS.surface),
      text: toColorShade(DARK_NEUTRALS.text),
      border: toColorShade(DARK_NEUTRALS.border),
    },
  }
}

/**
 * All available presets
 */
export const presets = {
  oceanBlue: oceanBluePreset,
  forestGreen: forestGreenPreset,
  midnight: midnightPreset,
} as const

/**
 * Preset names for type safety
 */
export type PresetName = keyof typeof presets

/**
 * Get a preset by name
 * @param name - Preset name
 * @returns Color preset
 * @example
 * ```typescript
 * const preset = getPreset('oceanBlue')
 * const primaryColor = preset.colors.primary.DEFAULT
 * ```
 */
export function getPreset(name: PresetName): ColorPreset {
  return presets[name]
}

/**
 * Get a preset with color mode applied
 * @param name - Preset name
 * @param mode - Color mode ('light' or 'dark')
 * @returns Color preset with mode-specific neutral colors
 * @example
 * ```typescript
 * const darkPreset = getPresetWithMode('oceanBlue', 'dark')
 * const bgColor = darkPreset.colors.background.DEFAULT
 * ```
 */
export function getPresetWithMode(name: PresetName, mode: 'light' | 'dark'): ColorPreset {
  const preset = getPreset(name)
  return mode === 'light' ? applyLightMode(preset) : applyDarkMode(preset)
}
