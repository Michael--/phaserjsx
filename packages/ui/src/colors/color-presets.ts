/**
 * Color preset definitions for PhaserJSX UI
 * Provides pre-configured color palettes with light/dark mode support
 */

import { HexColor, type ColorShade, type ColorTokens } from './color-types'
import { darkenHex, lightenHex } from './color-utils'

/**
 * Generate a complete color scale from a base color
 * Creates shades from lightest to darkest with the base color as DEFAULT
 * @param baseColor - The base color in hex format (e.g., '#2196f3')
 * @returns Complete ColorShade with all semantic levels as HexColor objects
 * @example
 * ```typescript
 * const primaryScale = generateColorScale('#2196f3')
 * // Usage: colors.primary.medium.toNumber()
 * ```
 */
export function generateColorScale(baseColor: string): ColorShade {
  return {
    lightest: HexColor.from(lightenHex(baseColor, 0.7)),
    light: HexColor.from(lightenHex(baseColor, 0.4)),
    medium: HexColor.from(lightenHex(baseColor, 0.15)),
    dark: HexColor.from(darkenHex(baseColor, 0.15)),
    darkest: HexColor.from(darkenHex(baseColor, 0.4)),
    DEFAULT: HexColor.from(baseColor),
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
    primary: generateColorScale('#2196f3'), // Material Blue
    secondary: generateColorScale('#607d8b'), // Blue Grey
    accent: generateColorScale('#00bcd4'), // Cyan

    // Feedback colors
    success: generateColorScale('#4caf50'), // Green
    warning: generateColorScale('#ff9800'), // Orange
    error: generateColorScale('#f44336'), // Red
    info: generateColorScale('#2196f3'), // Blue (same as primary)

    // Neutral colors - designed for light mode
    background: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#f5f5f5'),
      medium: HexColor.from('#e0e0e0'),
      dark: HexColor.from('#bdbdbd'),
      darkest: HexColor.from('#9e9e9e'),
      DEFAULT: HexColor.from('#fafafa'),
    },
    surface: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#f5f5f5'),
      medium: HexColor.from('#eeeeee'),
      dark: HexColor.from('#e0e0e0'),
      darkest: HexColor.from('#bdbdbd'),
      DEFAULT: HexColor.from('#ffffff'),
    },
    text: {
      lightest: HexColor.from('#9e9e9e'),
      light: HexColor.from('#757575'),
      medium: HexColor.from('#616161'),
      dark: HexColor.from('#424242'),
      darkest: HexColor.from('#212121'),
      DEFAULT: HexColor.from('#212121'),
    },
    border: {
      lightest: HexColor.from('#e0e0e0'),
      light: HexColor.from('#bdbdbd'),
      medium: HexColor.from('#9e9e9e'),
      dark: HexColor.from('#757575'),
      darkest: HexColor.from('#424242'),
      DEFAULT: HexColor.from('#bdbdbd'),
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
    primary: generateColorScale('#4caf50'), // Green
    secondary: generateColorScale('#8bc34a'), // Light Green
    accent: generateColorScale('#ffeb3b'), // Yellow

    // Feedback colors
    success: generateColorScale('#66bb6a'), // Light Green
    warning: generateColorScale('#ffa726'), // Orange
    error: generateColorScale('#ef5350'), // Red
    info: generateColorScale('#29b6f6'), // Light Blue

    // Neutral colors - designed for light mode
    background: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#f1f8e9'),
      medium: HexColor.from('#dcedc8'),
      dark: HexColor.from('#c5e1a5'),
      darkest: HexColor.from('#aed581'),
      DEFAULT: HexColor.from('#f9fbe7'),
    },
    surface: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#f9fbe7'),
      medium: HexColor.from('#f0f4c3'),
      dark: HexColor.from('#e6ee9c'),
      darkest: HexColor.from('#dce775'),
      DEFAULT: HexColor.from('#ffffff'),
    },
    text: {
      lightest: HexColor.from('#9e9e9e'),
      light: HexColor.from('#757575'),
      medium: HexColor.from('#616161'),
      dark: HexColor.from('#424242'),
      darkest: HexColor.from('#1b5e20'),
      DEFAULT: HexColor.from('#1b5e20'),
    },
    border: {
      lightest: HexColor.from('#dcedc8'),
      light: HexColor.from('#c5e1a5'),
      medium: HexColor.from('#aed581'),
      dark: HexColor.from('#9ccc65'),
      darkest: HexColor.from('#7cb342'),
      DEFAULT: HexColor.from('#c5e1a5'),
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
    primary: generateColorScale('#9c27b0'), // Purple
    secondary: generateColorScale('#673ab7'), // Deep Purple
    accent: generateColorScale('#e91e63'), // Pink

    // Feedback colors
    success: generateColorScale('#66bb6a'), // Green
    warning: generateColorScale('#ffa726'), // Orange
    error: generateColorScale('#ef5350'), // Red
    info: generateColorScale('#42a5f5'), // Blue

    // Neutral colors - designed for dark mode
    background: {
      lightest: HexColor.from('#424242'),
      light: HexColor.from('#303030'),
      medium: HexColor.from('#212121'),
      dark: HexColor.from('#1a1a1a'),
      darkest: HexColor.from('#0a0a0a'),
      DEFAULT: HexColor.from('#121212'),
    },
    surface: {
      lightest: HexColor.from('#424242'),
      light: HexColor.from('#303030'),
      medium: HexColor.from('#262626'),
      dark: HexColor.from('#1e1e1e'),
      darkest: HexColor.from('#121212'),
      DEFAULT: HexColor.from('#1e1e1e'),
    },
    text: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#e0e0e0'),
      medium: HexColor.from('#bdbdbd'),
      dark: HexColor.from('#9e9e9e'),
      darkest: HexColor.from('#757575'),
      DEFAULT: HexColor.from('#ffffff'),
    },
    border: {
      lightest: HexColor.from('#616161'),
      light: HexColor.from('#424242'),
      medium: HexColor.from('#303030'),
      dark: HexColor.from('#212121'),
      darkest: HexColor.from('#1a1a1a'),
      DEFAULT: HexColor.from('#424242'),
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
        lightest: HexColor.from('#ffffff'),
        light: HexColor.from('#f5f5f5'),
        medium: HexColor.from('#e0e0e0'),
        dark: HexColor.from('#bdbdbd'),
        darkest: HexColor.from('#9e9e9e'),
        DEFAULT: HexColor.from('#fafafa'),
      },
      surface: {
        lightest: HexColor.from('#ffffff'),
        light: HexColor.from('#f5f5f5'),
        medium: HexColor.from('#eeeeee'),
        dark: HexColor.from('#e0e0e0'),
        darkest: HexColor.from('#bdbdbd'),
        DEFAULT: HexColor.from('#ffffff'),
      },
      text: {
        lightest: HexColor.from('#9e9e9e'),
        light: HexColor.from('#757575'),
        medium: HexColor.from('#616161'),
        dark: HexColor.from('#424242'),
        darkest: HexColor.from('#212121'),
        DEFAULT: HexColor.from('#212121'),
      },
      border: {
        lightest: HexColor.from('#e0e0e0'),
        light: HexColor.from('#bdbdbd'),
        medium: HexColor.from('#9e9e9e'),
        dark: HexColor.from('#757575'),
        darkest: HexColor.from('#424242'),
        DEFAULT: HexColor.from('#bdbdbd'),
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
        lightest: HexColor.from('#424242'),
        light: HexColor.from('#303030'),
        medium: HexColor.from('#212121'),
        dark: HexColor.from('#1a1a1a'),
        darkest: HexColor.from('#0a0a0a'),
        DEFAULT: HexColor.from('#121212'),
      },
      surface: {
        lightest: HexColor.from('#424242'),
        light: HexColor.from('#303030'),
        medium: HexColor.from('#262626'),
        dark: HexColor.from('#1e1e1e'),
        darkest: HexColor.from('#121212'),
        DEFAULT: HexColor.from('#1e1e1e'),
      },
      text: {
        lightest: HexColor.from('#ffffff'),
        light: HexColor.from('#e0e0e0'),
        medium: HexColor.from('#bdbdbd'),
        dark: HexColor.from('#9e9e9e'),
        darkest: HexColor.from('#757575'),
        DEFAULT: HexColor.from('#ffffff'),
      },
      border: {
        lightest: HexColor.from('#616161'),
        light: HexColor.from('#424242'),
        medium: HexColor.from('#303030'),
        dark: HexColor.from('#212121'),
        darkest: HexColor.from('#1a1a1a'),
        DEFAULT: HexColor.from('#424242'),
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
