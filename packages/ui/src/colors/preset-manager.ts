/**
 * Dynamic color preset management
 */
import { themeRegistry } from '../theme'
import type { PresetName } from './color-presets'
import { getPresetWithMode } from './color-presets'

/**
 * Set the active color preset globally
 * Applies the preset with the current color mode and updates all components
 * @param presetName - Name of the preset to apply
 * @example
 * ```typescript
 * // Switch to forest green theme
 * setColorPreset('forestGreen')
 *
 * // Current mode (light/dark) is preserved
 * ```
 */
export function setColorPreset(presetName: PresetName): void {
  const currentMode = themeRegistry.getColorMode()
  const preset = getPresetWithMode(presetName, currentMode)

  // Update color tokens
  themeRegistry.setColorTokens(preset.colors)
  themeRegistry.setCurrentPresetName(presetName)

  // Notify all subscribers (triggers re-renders)
  // The subscription system already exists in ThemeRegistry
}

/**
 * Get the currently active preset name
 * @returns Current preset name or undefined
 */
export function getCurrentPreset(): string | undefined {
  return themeRegistry.getCurrentPresetName()
}
