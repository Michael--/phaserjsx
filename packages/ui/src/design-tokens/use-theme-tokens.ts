/**
 * Hook to access complete design token system
 * Combines colors with text styles, spacing, sizes, and radius tokens
 */
import { getPresetWithMode } from '../colors/color-presets'
import { useEffect, useState, useTheme } from '../hooks'
import { themeRegistry } from '../theme'
import {
  createTextStyleTokens,
  defaultRadiusTokens,
  defaultSizeTokens,
  defaultSpacingTokens,
} from './design-token-presets'
import type { DesignTokens } from './design-token-types'

/**
 * Hook to access complete design token system from theme context
 * Provides colors, text styles, spacing, sizes, and radius tokens
 * Automatically updates when color mode or preset changes
 * @returns Current DesignTokens or undefined
 * @example
 * ```typescript
 * function MyComponent() {
 *   const tokens = useThemeTokens()
 *
 *   if (!tokens) return null
 *
 *   return (
 *     <View
 *       backgroundColor={tokens.colors.surface.DEFAULT}
 *       padding={tokens.spacing.lg}
 *       cornerRadius={tokens.radius.md}
 *     >
 *       <Text text="Title" style={tokens.textStyles.title} />
 *       <Text text="Body text" style={tokens.textStyles.DEFAULT} />
 *     </View>
 *   )
 * }
 * ```
 */
export function useThemeTokens(): DesignTokens | undefined {
  const localTheme = useTheme()

  // Initialize design tokens state
  const getInitialTokens = (): DesignTokens | undefined => {
    // Check if local theme has color preset info
    if (localTheme?.__colorPreset) {
      const preset = getPresetWithMode(
        localTheme.__colorPreset.name as Parameters<typeof getPresetWithMode>[0],
        localTheme.__colorPreset.mode ?? 'light'
      )
      return {
        colors: preset.colors,
        textStyles: createTextStyleTokens(preset.colors.text.DEFAULT.toString()),
        spacing: defaultSpacingTokens,
        sizes: defaultSizeTokens,
        radius: defaultRadiusTokens,
      }
    }

    // Fall back to global tokens
    const colors = themeRegistry.getColorTokens()
    if (!colors) return undefined

    return {
      colors,
      textStyles: createTextStyleTokens(colors.text.DEFAULT.toString()),
      spacing: defaultSpacingTokens,
      sizes: defaultSizeTokens,
      radius: defaultRadiusTokens,
    }
  }

  const [tokens, setTokens] = useState<DesignTokens | undefined>(getInitialTokens())
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
        setTokens({
          colors: preset.colors,
          textStyles: createTextStyleTokens(preset.colors.text.DEFAULT.toString()),
          spacing: defaultSpacingTokens,
          sizes: defaultSizeTokens,
          radius: defaultRadiusTokens,
        })
      } else {
        // Use global tokens
        const colors = themeRegistry.getColorTokens()
        if (colors) {
          setTokens({
            colors,
            textStyles: createTextStyleTokens(colors.text.DEFAULT.toString()),
            spacing: defaultSpacingTokens,
            sizes: defaultSizeTokens,
            radius: defaultRadiusTokens,
          })
        }
      }
      // Force re-render when theme changes
      forceUpdate((n) => n + 1)
    })

    return unsubscribe
  }, [localTheme])

  return tokens
}
