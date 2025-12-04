/**
 * Theme configuration for docs-site examples
 */
import { createTheme, getPresetWithMode, setColorPreset, themeRegistry } from '@phaserjsx/ui'

/**
 * Create minimal theme for docs examples
 */
function createDocsTheme() {
  const preset = getPresetWithMode('oceanBlue', 'dark')
  return createTheme(
    {
      // Customize any global component themes here, got default preset styles
    },
    preset
  )
}

// Function to add theme to docs site
export function addThemeToDocs() {
  /**
   * Global theme for all PhaserJSX examples in docs
   */
  const docsTheme = createDocsTheme()

  // Set global theme ONCE (safe in module scope)
  themeRegistry.updateGlobalTheme(docsTheme)

  // Initialize color preset
  setColorPreset('oceanBlue')
}
