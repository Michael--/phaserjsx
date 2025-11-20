/**
 * Dynamic color preset management
 */
import { themeRegistry } from '../theme'
import type { PresetName } from './color-presets'
import { getPresetWithMode } from './color-presets'

// Subscribe to mode changes to update color tokens
themeRegistry.subscribe(() => {
  updateColorTokensForMode()
})

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
}

/**
 * Update color tokens based on current preset and mode
 * Called internally when color mode changes
 * @internal
 */
export function updateColorTokensForMode(): void {
  const presetName = themeRegistry.getCurrentPresetName()
  if (presetName) {
    const currentMode = themeRegistry.getColorMode()
    const preset = getPresetWithMode(presetName as PresetName, currentMode)
    themeRegistry.setColorTokens(preset.colors)
  }
}

/**
 * Get the currently active preset name
 * @returns Current preset name or undefined
 */
export function getCurrentPreset(): string | undefined {
  return themeRegistry.getCurrentPresetName()
}
