/**
 * Shared docs-site theme state
 */
/** @jsxImportSource react */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type DocsThemeMode = 'light' | 'dark'

interface DocsThemeContextValue {
  mode: DocsThemeMode
  darkMode: boolean
  toggleTheme: () => void
}

const STORAGE_KEY = 'phaserjsx-docs-theme'
const DocsThemeContext = createContext<DocsThemeContextValue | undefined>(undefined)

function getInitialMode(): DocsThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return 'dark'
}

export function DocsThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DocsThemeMode>(getInitialMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggleTheme = useCallback(() => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      mode,
      darkMode: mode === 'dark',
      toggleTheme,
    }),
    [mode, toggleTheme]
  )

  return <DocsThemeContext.Provider value={value}>{children}</DocsThemeContext.Provider>
}

export function useDocsTheme(): DocsThemeContextValue {
  const context = useContext(DocsThemeContext)
  if (!context) {
    throw new Error('useDocsTheme must be used within DocsThemeProvider')
  }
  return context
}
