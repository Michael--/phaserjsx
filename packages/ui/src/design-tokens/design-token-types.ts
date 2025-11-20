/**
 * Design token type definitions for PhaserJSX UI
 * Provides semantic tokens for text styles, spacing, sizes, and other design properties
 */
import type Phaser from 'phaser'
import type { ColorTokens } from '../colors'

/**
 * Text style preset token
 * Complete style object ready for Text component
 */
export interface TextStyleToken {
  fontSize: string | number
  color: string
  fontFamily?: string
  fontStyle?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

/**
 * Text style tokens for different use cases
 * Provides semantic presets for common text styles
 */
export interface TextStyleTokens {
  /** Default text style - base body text (16px) */
  DEFAULT: TextStyleToken
  /** Small text - captions, labels (12px) */
  small: TextStyleToken
  /** Medium text - body, paragraphs (16px) */
  medium: TextStyleToken
  /** Large text - subheadings, emphasis (20px) */
  large: TextStyleToken
  /** Title text - section titles (28px) */
  title: TextStyleToken
  /** Heading text - page headings (36px) */
  heading: TextStyleToken
  /** Caption text - footnotes, metadata (10px, reduced opacity) */
  caption: TextStyleToken
}

/**
 * Spacing scale tokens
 * Consistent spacing values for padding, margin, gaps
 */
export interface SpacingTokens {
  /** Extra small - 4px */
  xs: number
  /** Small - 8px */
  sm: number
  /** Medium - 16px */
  md: number
  /** Large - 24px */
  lg: number
  /** Extra large - 32px */
  xl: number
  /** Extra extra large - 48px */
  xxl: number
}

/**
 * Size scale tokens
 * For width, height, icon sizes, etc.
 */
export interface SizeTokens {
  /** Extra small - 16px */
  xs: number
  /** Small - 24px */
  sm: number
  /** Medium - 32px */
  md: number
  /** Large - 48px */
  lg: number
  /** Extra large - 64px */
  xl: number
  /** Extra extra large - 96px */
  xxl: number
}

/**
 * Border radius tokens
 * Consistent corner radius values
 */
export interface RadiusTokens {
  /** None - 0px */
  none: number
  /** Small - 4px */
  sm: number
  /** Medium - 8px */
  md: number
  /** Large - 16px */
  lg: number
  /** Extra large - 24px */
  xl: number
  /** Full - 9999px (pill shape) */
  full: number
}

/**
 * Complete design token system
 * Combines colors with semantic style tokens
 */
export interface DesignTokens {
  /** Color tokens - semantic color scales */
  colors: ColorTokens
  /** Text style presets - ready-to-use text styles */
  textStyles: TextStyleTokens
  /** Spacing scale - padding, margin, gaps */
  spacing: SpacingTokens
  /** Size scale - width, height, icon sizes */
  sizes: SizeTokens
  /** Border radius scale - corner radius values */
  radius: RadiusTokens
}

/**
 * Helper type to convert TextStyleToken to Phaser TextStyle
 * @internal
 */
export type PhaserTextStyle = Phaser.Types.GameObjects.Text.TextStyle
