/**
 * Global theme system for PhaserJSX
 * Provides type-safe theming with inheritance and component-specific styles
 */
import type { ColorTokens } from './colors'
import type { BackgroundProps, LayoutProps, TextSpecificProps, TransformProps } from './core-props'
import type { NodeType } from './core-types'
import { DebugLogger } from './dev-config'

/**
 * Type helper for nested component themes
 * Allows a component theme to include nested themes for child components
 */
export type NestedComponentThemes = {
  [K in keyof ComponentThemes]?: Partial<ComponentThemes[K]>
}

/**
 * Theme definition for View component
 * Includes all visual props that can be themed, plus nested component themes
 */
export interface ViewTheme
  extends Partial<TransformProps>,
    Partial<LayoutProps>,
    Partial<BackgroundProps>,
    NestedComponentThemes {}

/**
 * Theme definition for Text component
 * Includes all text-specific visual props that can be themed, plus nested component themes
 */
export interface TextTheme
  extends Partial<TransformProps>,
    Partial<TextSpecificProps>,
    NestedComponentThemes {
  // Legacy: support Phaser's style object directly
  style?: Phaser.Types.GameObjects.Text.TextStyle
}

/**
 * Theme definition for NineSlice component
 */
export interface NineSliceTheme extends Partial<TransformProps>, NestedComponentThemes {
  texture?: string
  leftWidth?: number
  rightWidth?: number
  topHeight?: number
  bottomHeight?: number
}

/**
 * Built-in component theme definitions
 */
export interface BuiltInComponentThemes {
  View: ViewTheme
  Text: TextTheme
  NineSlice: NineSliceTheme
}

/**
 * Custom component themes can be registered here
 * This allows custom components to extend the theme system
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomComponentThemes {
  // Custom components will extend this interface via module augmentation
  // Example:
  // Sidebar: { backgroundColor: number; width: number }
}

/**
 * Complete theme definition combining built-in and custom components
 */
export interface ComponentThemes extends BuiltInComponentThemes, CustomComponentThemes {}

/**
 * Partial theme - allows overriding specific component styles
 */
export type PartialTheme = {
  [K in keyof ComponentThemes]?: Partial<ComponentThemes[K]>
} & {
  /** Optional color preset configuration */
  __colorPreset?: {
    name: string
    mode?: 'light' | 'dark'
  }
}

/**
 * Complete theme with all component styles defined
 */
export type Theme = {
  [K in keyof ComponentThemes]: ComponentThemes[K]
}

/**
 * Default theme values for all built-in components
 */
export const defaultTheme: Theme = {
  View: {
    alpha: 1,
    visible: true,
  },
  Text: {
    text: '',
    align: 'left',
    alpha: 1,
    visible: true,
    style: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Arial',
    },
  },
  NineSlice: {
    alpha: 1,
    visible: true,
  },
}

/**
 * Global theme registry
 * Stores the current global theme and custom component themes
 */
class ThemeRegistry {
  private globalTheme: Theme = { ...defaultTheme }
  private customThemes: Map<string, Record<string, unknown>> = new Map()
  private colorTokens: ColorTokens | undefined = undefined
  private colorMode: 'light' | 'dark' = 'light'
  private currentPresetName: string | undefined = undefined
  private listeners: Set<() => void> = new Set()

  /**
   * Get the complete global theme
   */
  getGlobalTheme(): Readonly<Theme> {
    return { ...this.globalTheme, ...Object.fromEntries(this.customThemes) } as Theme
  }

  /**
   * Update global theme (deep merge)
   * @param theme - Partial theme to merge with current global theme
   */
  updateGlobalTheme(theme: PartialTheme): void {
    for (const [component, styles] of Object.entries(theme)) {
      if (component in this.globalTheme) {
        this.globalTheme[component as NodeType] = {
          ...this.globalTheme[component as NodeType],
          ...styles,
        } as never
        DebugLogger.log(
          'theme',
          `Updated ${component} theme:`,
          this.globalTheme[component as NodeType]
        )
      } else {
        // Custom component
        const existing = this.customThemes.get(component) ?? {}
        this.customThemes.set(component, { ...existing, ...styles })
      }
    }
  }

  /**
   * Set the entire global theme (replaces current theme)
   * @param theme - Complete theme to set
   */
  setGlobalTheme(theme: Theme): void {
    this.globalTheme = { ...theme }
  }

  /**
   * Reset global theme to default values
   */
  resetGlobalTheme(): void {
    this.globalTheme = { ...defaultTheme }
    this.customThemes.clear()
  }

  /**
   * Register a custom component theme
   * @param componentName - Name of the custom component
   * @param defaultStyles - Default styles for the component
   */
  registerCustomComponent<T extends Record<string, unknown>>(
    componentName: string,
    defaultStyles: T
  ): void {
    this.customThemes.set(componentName, defaultStyles)
  }

  /**
   * Get theme for a specific component
   * @param componentName - Component name
   * @returns Theme for the component
   */
  getComponentTheme<K extends keyof ComponentThemes>(componentName: K): ComponentThemes[K] {
    if (componentName in this.globalTheme) {
      const theme = this.globalTheme[componentName as NodeType] as ComponentThemes[K]
      return theme
    }
    return (this.customThemes.get(componentName as string) ?? {}) as ComponentThemes[K]
  }

  /**
   * Get all registered custom component names
   * @returns Set of custom component names
   */
  getCustomComponentNames(): Set<string> {
    return new Set(this.customThemes.keys())
  }

  /**
   * Set color tokens for the global theme
   * @param colors - ColorTokens to use globally
   */
  setColorTokens(colors: ColorTokens | undefined): void {
    this.colorTokens = colors
  }

  /**
   * Get current color tokens
   * @returns Current ColorTokens or undefined
   */
  getColorTokens(): ColorTokens | undefined {
    return this.colorTokens
  }

  /**
   * Get current color mode
   * @returns Current color mode
   */
  getColorMode(): 'light' | 'dark' {
    return this.colorMode
  }

  /**
   * Set color mode and notify listeners
   * @param mode - Color mode to set
   */
  setColorMode(mode: 'light' | 'dark'): void {
    if (this.colorMode !== mode) {
      this.colorMode = mode
      this.notifyListeners()
    }
  }

  /**
   * Get current preset name
   * @returns Current preset name or undefined
   */
  getCurrentPresetName(): string | undefined {
    return this.currentPresetName
  }

  /**
   * Set current preset name
   * @param name - Preset name
   */
  setCurrentPresetName(name: string | undefined): void {
    this.currentPresetName = name
  }

  /**
   * Subscribe to theme changes
   * @param listener - Callback to invoke on theme change
   * @returns Unsubscribe function
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }
}

/**
 * Global theme registry instance
 */
export const themeRegistry = new ThemeRegistry()

/**
 * Deep merge two theme objects
 * @param base - Base theme
 * @param override - Override theme
 * @returns Merged theme
 */
export function mergeThemes(base: PartialTheme, override: PartialTheme): PartialTheme {
  const result: PartialTheme = { ...base }

  for (const [component, styles] of Object.entries(override)) {
    if (component in result) {
      result[component as keyof ComponentThemes] = {
        ...result[component as keyof ComponentThemes],
        ...styles,
      } as never
    } else {
      result[component as keyof ComponentThemes] = styles as never
    }
  }

  return result
}

/**
 * Helper to create a partial theme with type safety
 * Optionally accepts a color preset to automatically populate color tokens
 * @param theme - Partial theme definition
 * @param colorPreset - Optional color preset to apply
 * @returns The same theme (for type checking)
 * @example
 * ```typescript
 * import { getPreset } from './colors'
 *
 * const preset = getPreset('oceanBlue')
 * const theme = createTheme({
 *   Button: {
 *     backgroundColor: preset.colors.primary.DEFAULT
 *   }
 * }, preset)
 * ```
 */
export function createTheme(
  theme: PartialTheme,
  colorPreset?: { name: string; colors: ColorTokens; mode?: 'light' | 'dark' }
): PartialTheme {
  if (colorPreset) {
    // Store color tokens in registry for useColors hook
    themeRegistry.setColorTokens(colorPreset.colors)

    // Add preset metadata to theme
    return {
      ...theme,
      __colorPreset: {
        name: colorPreset.name,
        mode: colorPreset.mode ?? 'light',
      },
    }
  }

  return theme
}

/**
 * Get themed props for a component, merging global theme, local theme override, and explicit props
 * Explicit props take highest priority, then local theme, then global theme
 * Also extracts nested component themes to pass down to children
 * @param componentName - Component name
 * @param localTheme - Local theme override (from theme prop in VDOM tree)
 * @param explicitProps - Explicit props passed to component
 * @returns Object with merged props and nested themes for child components
 */
function deepMergeDefined<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base }
  for (const key in override) {
    const value = override[key]
    if (value !== undefined) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof base[key] === 'object' &&
        base[key] !== null
      ) {
        // Deep merge for nested objects (e.g. style)
        ;(result as unknown as Record<string, unknown>)[key] = deepMergeDefined(
          base[key] as object,
          value as object
        )
      } else {
        ;(result as unknown as Record<string, unknown>)[key] = value
      }
    }
  }
  return result as T
}

/**
 * Helper to extract nested component themes from a theme object
 * Separates own props from nested component themes
 * Detects nested themes by checking if the property value is an object
 * and the key starts with uppercase (convention for component names)
 * @param theme - Theme object that might contain nested themes
 * @returns Object with ownProps and nestedThemes
 */
function extractNestedThemes<T extends object>(
  theme: T
): { ownProps: T; nestedThemes: PartialTheme } {
  const ownProps = { ...theme }
  const nestedThemes: PartialTheme = {}

  // Get all registered component names (built-in + custom)
  const allComponentNames = new Set([
    'View',
    'Text',
    'NineSlice',
    ...Array.from(themeRegistry.getCustomComponentNames()),
  ])

  for (const key in ownProps) {
    // Check if this key is a component name (starts with uppercase or is in our registry)
    if (allComponentNames.has(key)) {
      nestedThemes[key as keyof ComponentThemes] = (ownProps as never)[key]
      delete (ownProps as never)[key]
    }
  }

  return { ownProps, nestedThemes }
}

export function getThemedProps<
  K extends keyof ComponentThemes,
  P extends Partial<ComponentThemes[K]>,
>(
  componentName: K,
  localTheme: PartialTheme | undefined,
  explicitProps: P
): { props: ComponentThemes[K] & P; nestedTheme: PartialTheme } {
  // Start with global theme for this component
  const globalComponentTheme = themeRegistry.getComponentTheme(componentName)

  // Extract nested themes from global theme
  const { ownProps: globalOwnProps, nestedThemes: globalNestedThemes } =
    extractNestedThemes(globalComponentTheme)

  // Apply local theme override if provided
  // IMPORTANT: localTheme can be either:
  // 1. Parent's nested theme (propagated down)
  // 2. Component's own theme (from theme prop via __theme)
  // We need to check if localTheme contains this component's theme OR nested themes
  const localComponentTheme = localTheme?.[componentName] ?? {}

  const { ownProps: localOwnProps, nestedThemes: localNestedThemes } =
    extractNestedThemes(localComponentTheme)

  // Also extract nested themes directly from localTheme (for theme prop case)
  const { nestedThemes: localThemeNested } = extractNestedThemes(localTheme ?? {})

  // Extract nested themes from explicit props
  const { ownProps: explicitOwnProps, nestedThemes: explicitNestedThemes } =
    extractNestedThemes(explicitProps)

  // Merge: global < local < explicit, but only defined values
  const mergedProps = {
    ...deepMergeDefined(globalOwnProps as object, localOwnProps),
    ...deepMergeDefined({}, explicitOwnProps),
  } as ComponentThemes[K] & P

  // Merge nested themes: global < localComponent < localTheme < explicit
  const mergedNestedThemes = mergeThemes(
    mergeThemes(mergeThemes(globalNestedThemes, localNestedThemes), localThemeNested),
    explicitNestedThemes
  )

  DebugLogger.log(
    'theme',
    `getThemedProps(${String(componentName)}): FINAL mergedProps:`,
    mergedProps
  )

  return {
    props: mergedProps,
    nestedTheme: mergedNestedThemes,
  }
}
