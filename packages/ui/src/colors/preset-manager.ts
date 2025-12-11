/**
 * Dynamic color preset management
 */
import { themeRegistry } from '../theme'
import type { PresetName } from './color-presets'
import { getPresetWithMode } from './color-presets'

/**
 * Set the active color preset globally
 * Applies the preset with the current color mode and updates all components
 * Triggers complete remount of all active mountJSX instances
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

  // Update color tokens WITHOUT notifying listeners
  // We skip listener notifications to prevent unnecessary re-renders
  themeRegistry.setColorTokens(preset.colors)
  themeRegistry.setCurrentPresetName(presetName, true) // true = skip notify

  // Trigger complete remount of all VDOM trees to apply new preset
  // Using setTimeout(0) to ensure all synchronous state updates complete first
  setTimeout(() => {
    // Import remountAll lazily to avoid circular dependency
    import('../vdom').then(({ remountAll }) => {
      remountAll()
    })
  }, 0)
}

/**
 * Get the currently active preset name
 * @returns Current preset name or undefined
 */
export function getCurrentPreset(): string | undefined {
  return themeRegistry.getCurrentPresetName()
}

/**
 * Get all available preset names
 * @returns Array of preset names
 * @example
 * ```typescript
 * const presets = getAvailablePresets() // ['oceanBlue', 'forestGreen', 'midnight']
 * ```
 */
export function getAvailablePresets(): PresetName[] {
  return ['oceanBlue', 'forestGreen', 'midnight']
}
