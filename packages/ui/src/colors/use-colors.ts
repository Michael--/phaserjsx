/**
 * Color system hooks for component usage
 */
import { useEffect, useRef, useState, useTheme } from '../hooks'
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
 * ```
 */
export function useColors(): ColorTokens | undefined {
  const localTheme = useTheme()

  // Track latest localTheme via ref to avoid re-subscribing on every render
  const localThemeRef = useRef(localTheme)
  localThemeRef.current = localTheme

  const [colors, setColors] = useState<ColorTokens | undefined>(
    localTheme?.__colorPreset
      ? getPresetWithMode(
          localTheme.__colorPreset.name as Parameters<typeof getPresetWithMode>[0],
          localTheme.__colorPreset.mode ?? 'light'
        ).colors
      : themeRegistry.getColorTokens()
  )

  useEffect(() => {
    const unsubscribe = themeRegistry.subscribe(() => {
      const current = localThemeRef.current
      if (current?.__colorPreset) {
        const currentMode = themeRegistry.getColorMode()
        const preset = getPresetWithMode(
          current.__colorPreset.name as Parameters<typeof getPresetWithMode>[0],
          currentMode
        )
        setColors(preset.colors)
      } else {
        setColors(themeRegistry.getColorTokens())
      }
    })
    return unsubscribe
  }, []) // Subscribe once, read latest theme via ref

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
