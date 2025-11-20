/**
 * Default design token presets
 * Provides sensible defaults for text styles, spacing, sizes, and radius
 */
import type { RadiusTokens, SizeTokens, SpacingTokens, TextStyleTokens } from './design-token-types'

/**
 * Default spacing scale
 * Based on 4px base unit
 */
export const defaultSpacingTokens: SpacingTokens = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

/**
 * Default size scale
 * For width, height, icon sizes, etc.
 */
export const defaultSizeTokens: SizeTokens = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 96,
}

/**
 * Default border radius scale
 */
export const defaultRadiusTokens: RadiusTokens = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
}

/**
 * Create text style tokens with the given base text color
 * @param textColor - Base text color (hex string)
 * @returns TextStyleTokens with color applied
 */
export function createTextStyleTokens(textColor: string): TextStyleTokens {
  return {
    DEFAULT: {
      fontSize: '16px',
      color: textColor,
      fontFamily: 'Arial',
      align: 'left',
    },
    small: {
      fontSize: '12px',
      color: textColor,
      fontFamily: 'Arial',
      align: 'left',
    },
    medium: {
      fontSize: '16px',
      color: textColor,
      fontFamily: 'Arial',
      align: 'left',
    },
    large: {
      fontSize: '20px',
      color: textColor,
      fontFamily: 'Arial',
      align: 'left',
    },
    title: {
      fontSize: '28px',
      color: textColor,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
    },
    heading: {
      fontSize: '36px',
      color: textColor,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
    },
    caption: {
      fontSize: '10px',
      color: textColor,
      fontFamily: 'Arial',
      align: 'left',
    },
  }
}

/**
 * Default text style tokens (white text)
 */
export const defaultTextStyleTokens: TextStyleTokens = createTextStyleTokens('#ffffff')
