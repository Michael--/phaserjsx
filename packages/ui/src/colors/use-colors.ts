/**
 * Color system hooks for component usage
 */
import { useTheme } from '../hooks'
import { themeRegistry } from '../theme'
import type { ColorTokens } from './color-types'

/**
 * Hook to access color tokens from theme context
 * Returns ColorTokens if available in theme, otherwise undefined
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

  // Check if local theme has color preset info
  if (localTheme?.__colorPreset) {
    // This would be resolved by preset system in Phase 4
    // For now, return undefined as presets aren't yet integrated
    return undefined
  }

  // Fall back to global color tokens
  return themeRegistry.getColorTokens()
}
