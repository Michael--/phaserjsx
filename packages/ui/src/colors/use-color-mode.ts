/**
 * Color mode management for dynamic theme switching
 */
import { useEffect, useState } from '../hooks'
import { themeRegistry } from '../theme'

/**
 * Hook to manage color mode (light/dark) dynamically
 * @returns Object with current mode, toggle function, and setter
 * @example
 * ```typescript
 * function ThemeToggle() {
 *   const { colorMode, toggleColorMode } = useColorMode()
 *
 *   return (
 *     <Button onClick={toggleColorMode}>
 *       {colorMode === 'light' ? 'Dark' : 'Light'} Mode
 *     </Button>
 *   )
 * }
 * ```
 */
export function useColorMode(): {
  colorMode: 'light' | 'dark'
  setColorMode: (mode: 'light' | 'dark') => void
  toggleColorMode: () => void
} {
  const [colorMode, setColorModeState] = useState<'light' | 'dark'>(themeRegistry.getColorMode())

  useEffect(() => {
    // Subscribe to theme registry changes
    const unsubscribe = themeRegistry.subscribe(() => {
      setColorModeState(themeRegistry.getColorMode())
    })

    return unsubscribe
  }, [])

  const setColorMode = (mode: 'light' | 'dark') => {
    themeRegistry.setColorMode(mode)
  }

  const toggleColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(newMode)
  }

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
  }
}
