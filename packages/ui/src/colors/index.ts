/**
 * Color system public API
 * @module @number10/phaserjsx/colors
 */

// Types
export { HexColor } from './color-types'
export type { ColorMode, ColorShade, ColorTokens, RGBColor, ShadeLevel } from './color-types'

// Conversion utilities
export { hexToNumber, numberToHex, numberToRgb, rgbToNumber } from './color-utils'

// Color manipulation
export { alpha, darken, darkenHex, hex, lighten, lightenHex } from './color-utils'
export type { HexColorWrapper } from './color-utils'

// Contrast utilities
export { createTextStyle, ensureContrast, getContrastRatio } from './color-utils'

// Presets
export {
  applyDarkMode,
  applyLightMode,
  forestGreenPreset,
  generateColorScale,
  getPreset,
  getPresetWithMode,
  midnightPreset,
  oceanBluePreset,
  presets,
} from './color-presets'
export type { ColorPreset, PresetName } from './color-presets'

// Hooks
export { useColorMode } from './use-color-mode'
export { useColors, useThemeSubscription } from './use-colors'

// Theme helpers
export {
  colorsToTheme,
  getBackgroundColor,
  getBorderColor,
  getSurfaceColor,
  getTextColor,
} from './color-theme-helpers'

// Preset management
export {
  getAvailablePresets,
  getCurrentPreset,
  setColorMode,
  setColorPreset,
} from './preset-manager'
