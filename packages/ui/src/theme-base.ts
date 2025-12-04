/**
 * Base theme type definitions
 * This file contains the core theme system types and interfaces
 */
import type {
  BackgroundProps,
  LayoutProps,
  PhaserProps,
  TextSpecificProps,
  TransformProps,
} from './core-props'

/**
 * Type helper for nested component themes
 * Allows a component theme to include nested themes for child components
 * Excludes lowercase primitives to avoid conflicts with prop names
 */
export type NestedComponentThemes = {
  [K in Exclude<
    keyof ComponentThemes,
    'view' | 'text' | 'nineslice' | 'sprite' | 'image' | 'graphics' | 'tilesprite'
  >]?: Partial<ComponentThemes[K]>
}

/**
 * Theme definition for View component
 * Includes all visual props that can be themed, plus nested component themes
 */
export interface ViewTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    Partial<LayoutProps>,
    Partial<BackgroundProps>,
    NestedComponentThemes {}

/**
 * Theme definition for Text component
 * Includes all text-specific visual props that can be themed, plus nested component themes
 */
export interface TextTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    Partial<TextSpecificProps>,
    NestedComponentThemes {
  // Legacy: support Phaser's style object directly
  style?: Phaser.Types.GameObjects.Text.TextStyle
}

/**
 * Theme definition for NineSlice component
 */
export interface NineSliceTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  texture?: string
  leftWidth?: number
  rightWidth?: number
  topHeight?: number
  bottomHeight?: number
}

/**
 * Theme definition for Sprite component (dummy - minimal theme support)
 */
export interface SpriteTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  texture?: string
  tint?: number
}

/**
 * Theme definition for Image component (dummy - minimal theme support)
 */
export interface ImageTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  texture?: string
  tint?: number
}

/**
 * Theme definition for Graphics component (dummy - minimal theme support)
 */
export interface GraphicsTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {}

/**
 * Theme definition for TileSprite component (dummy - minimal theme support)
 */
export interface TileSpriteTheme
  extends Partial<TransformProps>,
    Partial<PhaserProps>,
    NestedComponentThemes {
  texture?: string
  tint?: number
}

/**
 * Built-in component theme definitions
 */
export interface BuiltInComponentThemes {
  // Primitives (lowercase) - internal use
  view: ViewTheme
  text: TextTheme
  nineslice: NineSliceTheme
  sprite: SpriteTheme
  image: ImageTheme
  graphics: GraphicsTheme
  tilesprite: TileSpriteTheme
  // Public API (uppercase)
  View: ViewTheme
  Text: TextTheme
  NineSlice: NineSliceTheme
  Sprite: SpriteTheme
  Image: ImageTheme
  Graphics: GraphicsTheme
  TileSprite: TileSpriteTheme
}

/**
 * Custom component themes - imported from theme-custom
 */
import type { CustomComponentThemes } from './theme-custom'

/**
 * Complete theme definition combining built-in and custom components
 */
export interface ComponentThemes extends BuiltInComponentThemes, CustomComponentThemes {}

// Re-export CustomComponentThemes
export type { CustomComponentThemes }

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
 * Built-in components are required, custom components are optional
 */
export type Theme = {
  [K in keyof BuiltInComponentThemes]: BuiltInComponentThemes[K]
} & {
  [K in keyof Omit<ComponentThemes, keyof BuiltInComponentThemes>]?: ComponentThemes[K]
}
