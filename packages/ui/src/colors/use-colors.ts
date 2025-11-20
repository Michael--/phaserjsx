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
 * @deprecated Use `useThemeTokens()` instead for access to colors, text styles, spacing, and more
 * @example
 * ```typescript
 * // Old way (deprecated):
 * const colors = useColors()
 *
 * // New way:
 * const tokens = useThemeTokens()
 * const colors = tokens?.colors
 *
 * // Access text styles, spacing, etc.:
 * <Text style={tokens.textStyles.DEFAULT} />
 * <View padding={tokens.spacing.lg} />
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
  const [, forceUpdate] = useState(0)

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
      // Force re-render when theme changes
      forceUpdate((n) => n + 1)
    })

    return unsubscribe
  }, [localTheme])

  return colors
}

/**
 * Hook to subscribe to theme changes without accessing colors
 * Use this in parent components that don't need colors themselves
 * but want to ensure children re-render when theme changes
 *
 * Note: Since useColors() now triggers re-renders automatically,
 * this hook is mainly useful if you don't need the colors themselves
 * but still want to react to theme changes.
 *
 * @example
 * ```typescript
 * function ParentComponent() {
 *   useThemeSubscription() // Children will re-render on theme changes
 *   return <ChildThatUsesColors />
 * }
 * ```
 */
export function useThemeSubscription(): void {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const unsubscribe = themeRegistry.subscribe(() => {
      forceUpdate((n) => n + 1)
    })
    return unsubscribe
  }, [])
}
