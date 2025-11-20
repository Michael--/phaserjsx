/**
 * Color system public API
 * @module @phaserjsx/ui/colors
 */

// Types
export type { ColorMode, ColorShade, ColorTokens, RGBColor, ShadeLevel } from './color-types'

// Conversion utilities
export { hexToNumber, numberToHex, numberToRgb, rgbToNumber } from './color-utils'

// Color manipulation
export { alpha, darken, lighten } from './color-utils'

// Contrast utilities
export { ensureContrast, getContrastRatio } from './color-utils'

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
export { useColors } from './use-colors'

// Theme helpers
export {
  colorsToTheme,
  getBackgroundColor,
  getBorderColor,
  getSurfaceColor,
  getTextColor,
} from './color-theme-helpers'

// Preset management
export { getAvailablePresets, getCurrentPreset, setColorPreset } from './preset-manager'
