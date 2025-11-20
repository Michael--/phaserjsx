/**
 * Color system hooks for component usage
 */
import { useEffect, useState, useTheme } from '../hooks'
import { themeRegistry } from '../theme'
import { getPresetWithMode } from './color-presets'
import type { ColorTokens } from './color-types'

/**
 * Hook to access color tokens from theme context
 * Automatically updates when color mode or preset changes
 * @returns Current ColorTokens or undefined
 * @example
 * ```typescript
 * function MyComponent() {
 *   const colors = useColors()
 *
 *   if (!colors) return null
 *
 *   return (
 *     <View backgroundColor={colors.primary.DEFAULT}>
 *       <Text style={{ color: colors.text.DEFAULT }} />
 *     </View>
 *   )
 * }
 * ```
 */
export function useColors(): ColorTokens | undefined {
  const localTheme = useTheme()

  // Initialize colors state
  const getInitialColors = (): ColorTokens | undefined => {
    // Check if local theme has color preset info
    if (localTheme?.__colorPreset) {
      const preset = getPresetWithMode(
        localTheme.__colorPreset.name as Parameters<typeof getPresetWithMode>[0],
        localTheme.__colorPreset.mode ?? 'light'
      )
      return preset.colors
    }

    // Fall back to global color tokens
    return themeRegistry.getColorTokens()
  }

  const [colors, setColors] = useState<ColorTokens | undefined>(getInitialColors())

  useEffect(() => {
    // Subscribe to theme changes (mode/preset switches)
    const unsubscribe = themeRegistry.subscribe(() => {
      // Check if local theme has preset
      if (localTheme?.__colorPreset) {
        const currentMode = themeRegistry.getColorMode()
        const preset = getPresetWithMode(
          localTheme.__colorPreset.name as Parameters<typeof getPresetWithMode>[0],
          currentMode
        )
        setColors(preset.colors)
      } else {
        // Use global tokens
        setColors(themeRegistry.getColorTokens())
      }
    })

    return unsubscribe
  }, [localTheme])

  return colors
}
