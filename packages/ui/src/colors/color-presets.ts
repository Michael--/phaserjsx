/**
 * Color preset definitions for PhaserJSX UI
 * Provides pre-configured color palettes with light/dark mode support
 */

import type { ColorShade, ColorTokens } from './color-types'
import { darken, lighten } from './color-utils'

/**
 * Generate a complete color scale from a base color
 * Creates shades from lightest to darkest with the base color as DEFAULT
 * @param baseColor - The base color to generate shades from
 * @returns Complete ColorShade with all semantic levels
 * @example
 * ```typescript
 * const primaryScale = generateColorScale(0x2196f3)
 * // Returns: { lightest: ..., light: ..., medium: ..., dark: ..., darkest: ..., DEFAULT: 0x2196f3 }
 * ```
 */
export function generateColorScale(baseColor: number): ColorShade {
  return {
    lightest: lighten(baseColor, 0.7),
    light: lighten(baseColor, 0.4),
    medium: lighten(baseColor, 0.15),
    dark: darken(baseColor, 0.15),
    darkest: darken(baseColor, 0.4),
    DEFAULT: baseColor,
  }
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
    primary: generateColorScale(0x2196f3), // Material Blue
    secondary: generateColorScale(0x607d8b), // Blue Grey
    accent: generateColorScale(0x00bcd4), // Cyan

    // Feedback colors
    success: generateColorScale(0x4caf50), // Green
    warning: generateColorScale(0xff9800), // Orange
    error: generateColorScale(0xf44336), // Red
    info: generateColorScale(0x2196f3), // Blue (same as primary)

    // Neutral colors - designed for light mode
    background: {
      lightest: 0xffffff,
      light: 0xf5f5f5,
      medium: 0xe0e0e0,
      dark: 0xbdbdbd,
      darkest: 0x9e9e9e,
      DEFAULT: 0xfafafa,
    },
    surface: {
      lightest: 0xffffff,
      light: 0xf5f5f5,
      medium: 0xeeeeee,
      dark: 0xe0e0e0,
      darkest: 0xbdbdbd,
      DEFAULT: 0xffffff,
    },
    text: {
      lightest: 0x9e9e9e,
      light: 0x757575,
      medium: 0x616161,
      dark: 0x424242,
      darkest: 0x212121,
      DEFAULT: 0x212121,
    },
    border: {
      lightest: 0xe0e0e0,
      light: 0xbdbdbd,
      medium: 0x9e9e9e,
      dark: 0x757575,
      darkest: 0x424242,
      DEFAULT: 0xbdbdbd,
    },
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
    primary: generateColorScale(0x4caf50), // Green
    secondary: generateColorScale(0x8bc34a), // Light Green
    accent: generateColorScale(0xffeb3b), // Yellow

    // Feedback colors
    success: generateColorScale(0x66bb6a), // Light Green
    warning: generateColorScale(0xffa726), // Orange
    error: generateColorScale(0xef5350), // Red
    info: generateColorScale(0x29b6f6), // Light Blue

    // Neutral colors - designed for light mode
    background: {
      lightest: 0xffffff,
      light: 0xf1f8e9,
      medium: 0xdcedc8,
      dark: 0xc5e1a5,
      darkest: 0xaed581,
      DEFAULT: 0xf9fbe7,
    },
    surface: {
      lightest: 0xffffff,
      light: 0xf9fbe7,
      medium: 0xf0f4c3,
      dark: 0xe6ee9c,
      darkest: 0xdce775,
      DEFAULT: 0xffffff,
    },
    text: {
      lightest: 0x9e9e9e,
      light: 0x757575,
      medium: 0x616161,
      dark: 0x424242,
      darkest: 0x1b5e20,
      DEFAULT: 0x1b5e20,
    },
    border: {
      lightest: 0xdcedc8,
      light: 0xc5e1a5,
      medium: 0xaed581,
      dark: 0x9ccc65,
      darkest: 0x7cb342,
      DEFAULT: 0xc5e1a5,
    },
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
    primary: generateColorScale(0x9c27b0), // Purple
    secondary: generateColorScale(0x673ab7), // Deep Purple
    accent: generateColorScale(0xe91e63), // Pink

    // Feedback colors
    success: generateColorScale(0x66bb6a), // Green
    warning: generateColorScale(0xffa726), // Orange
    error: generateColorScale(0xef5350), // Red
    info: generateColorScale(0x42a5f5), // Blue

    // Neutral colors - designed for dark mode
    background: {
      lightest: 0x424242,
      light: 0x303030,
      medium: 0x212121,
      dark: 0x1a1a1a,
      darkest: 0x0a0a0a,
      DEFAULT: 0x121212,
    },
    surface: {
      lightest: 0x424242,
      light: 0x303030,
      medium: 0x262626,
      dark: 0x1e1e1e,
      darkest: 0x121212,
      DEFAULT: 0x1e1e1e,
    },
    text: {
      lightest: 0xffffff,
      light: 0xe0e0e0,
      medium: 0xbdbdbd,
      dark: 0x9e9e9e,
      darkest: 0x757575,
      DEFAULT: 0xffffff,
    },
    border: {
      lightest: 0x616161,
      light: 0x424242,
      medium: 0x303030,
      dark: 0x212121,
      darkest: 0x1a1a1a,
      DEFAULT: 0x424242,
    },
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
      background: {
        lightest: 0xffffff,
        light: 0xf5f5f5,
        medium: 0xe0e0e0,
        dark: 0xbdbdbd,
        darkest: 0x9e9e9e,
        DEFAULT: 0xfafafa,
      },
      surface: {
        lightest: 0xffffff,
        light: 0xf5f5f5,
        medium: 0xeeeeee,
        dark: 0xe0e0e0,
        darkest: 0xbdbdbd,
        DEFAULT: 0xffffff,
      },
      text: {
        lightest: 0x9e9e9e,
        light: 0x757575,
        medium: 0x616161,
        dark: 0x424242,
        darkest: 0x212121,
        DEFAULT: 0x212121,
      },
      border: {
        lightest: 0xe0e0e0,
        light: 0xbdbdbd,
        medium: 0x9e9e9e,
        dark: 0x757575,
        darkest: 0x424242,
        DEFAULT: 0xbdbdbd,
      },
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
      background: {
        lightest: 0x424242,
        light: 0x303030,
        medium: 0x212121,
        dark: 0x1a1a1a,
        darkest: 0x0a0a0a,
        DEFAULT: 0x121212,
      },
      surface: {
        lightest: 0x424242,
        light: 0x303030,
        medium: 0x262626,
        dark: 0x1e1e1e,
        darkest: 0x121212,
        DEFAULT: 0x1e1e1e,
      },
      text: {
        lightest: 0xffffff,
        light: 0xe0e0e0,
        medium: 0xbdbdbd,
        dark: 0x9e9e9e,
        darkest: 0x757575,
        DEFAULT: 0xffffff,
      },
      border: {
        lightest: 0x616161,
        light: 0x424242,
        medium: 0x303030,
        dark: 0x212121,
        darkest: 0x1a1a1a,
        DEFAULT: 0x424242,
      },
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
