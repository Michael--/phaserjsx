/**
 * Global theme system for PhaserJSX
 * Provides type-safe theming with inheritance and component-specific styles
 */
import type { BackgroundProps, LayoutProps, TextSpecificProps, TransformProps } from './core-props'
import type { NodeType } from './core-types'
import { DebugLogger } from './dev-config'

/**
 * Theme definition for View component
 * Includes all visual props that can be themed
 */
export interface ViewTheme
  extends Partial<TransformProps>,
    Partial<LayoutProps>,
    Partial<BackgroundProps> {}

/**
 * Theme definition for Text component
 * Includes all text-specific visual props that can be themed
 */
export interface TextTheme extends Partial<TransformProps>, Partial<TextSpecificProps> {
  // Legacy: support Phaser's style object directly
  style?: Phaser.Types.GameObjects.Text.TextStyle
}

/**
 * Theme definition for NineSlice component
 */
export interface NineSliceTheme extends Partial<TransformProps> {
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
    DebugLogger.log('theme', 'updateGlobalTheme called with:', theme)
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
      DebugLogger.log('theme', `getComponentTheme(${String(componentName)}):`, theme)
      return theme
    }
    return (this.customThemes.get(componentName as string) ?? {}) as ComponentThemes[K]
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
 * @param theme - Partial theme definition
 * @returns The same theme (for type checking)
 */
export function createTheme(theme: PartialTheme): PartialTheme {
  return theme
}

/**
 * Get themed props for a component, merging global theme, local theme override, and explicit props
 * Explicit props take highest priority, then local theme, then global theme
 * @param componentName - Component name
 * @param localTheme - Local theme override (from theme prop in VDOM tree)
 * @param explicitProps - Explicit props passed to component
 * @returns Merged props with theme applied
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

export function getThemedProps<
  K extends keyof ComponentThemes,
  P extends Partial<ComponentThemes[K]>,
>(
  componentName: K,
  localTheme: PartialTheme | undefined,
  explicitProps: P
): ComponentThemes[K] & P {
  // Start with global theme for this component
  const globalComponentTheme = themeRegistry.getComponentTheme(componentName)
  // Apply local theme override if provided
  const localComponentTheme = localTheme?.[componentName] ?? {}
  // Merge: global < local < explicit, but only defined values
  return {
    ...deepMergeDefined(globalComponentTheme, localComponentTheme),
    ...deepMergeDefined({}, explicitProps),
  } as ComponentThemes[K] & P
}
