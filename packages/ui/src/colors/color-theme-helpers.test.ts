/**
 * Tests for color theme helper functions
 */
import { describe, expect, it } from 'vitest'
import { generateColorScale, getPreset } from './color-presets'
import {
  colorsToTheme,
  getBackgroundColor,
  getBorderColor,
  getSurfaceColor,
  getTextColor,
} from './color-theme-helpers'
import type { ColorTokens } from './color-types'
import { HexColor } from './color-types'

/** Minimal valid ColorTokens for testing */
function createMockTokens(): ColorTokens {
  return {
    primary: generateColorScale('#2196f3'),
    secondary: generateColorScale('#607d8b'),
    accent: generateColorScale('#00bcd4'),
    success: generateColorScale('#4caf50'),
    warning: generateColorScale('#ff9800'),
    error: generateColorScale('#f44336'),
    info: generateColorScale('#2196f3'),
    background: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#f5f5f5'),
      medium: HexColor.from('#e0e0e0'),
      dark: HexColor.from('#bdbdbd'),
      darkest: HexColor.from('#9e9e9e'),
      DEFAULT: HexColor.from('#e0e0e0'),
    },
    surface: {
      lightest: HexColor.from('#ffffff'),
      light: HexColor.from('#f5f5f5'),
      medium: HexColor.from('#eeeeee'),
      dark: HexColor.from('#e0e0e0'),
      darkest: HexColor.from('#bdbdbd'),
      DEFAULT: HexColor.from('#eeeeee'),
    },
    text: {
      lightest: HexColor.from('#9e9e9e'),
      light: HexColor.from('#757575'),
      medium: HexColor.from('#616161'),
      dark: HexColor.from('#424242'),
      darkest: HexColor.from('#212121'),
      DEFAULT: HexColor.from('#616161'),
    },
    border: {
      lightest: HexColor.from('#e0e0e0'),
      light: HexColor.from('#bdbdbd'),
      medium: HexColor.from('#9e9e9e'),
      dark: HexColor.from('#757575'),
      darkest: HexColor.from('#424242'),
      DEFAULT: HexColor.from('#9e9e9e'),
    },
  }
}

describe('colorsToTheme', () => {
  const tokens = getPreset('oceanBlue').colors

  it('returns backgroundColor from DEFAULT shade by default', () => {
    const result = colorsToTheme(tokens, 'primary')
    expect(result.backgroundColor).toBe(tokens.primary.DEFAULT.toNumber())
  })

  it('returns borderColor from dark shade by default', () => {
    const result = colorsToTheme(tokens, 'primary')
    expect(result.borderColor).toBe(tokens.primary.dark.toNumber())
  })

  it('uses custom backgroundShade', () => {
    const result = colorsToTheme(tokens, 'primary', { backgroundShade: 'lightest' })
    expect(result.backgroundColor).toBe(tokens.primary.lightest.toNumber())
  })

  it('uses custom borderShade', () => {
    const result = colorsToTheme(tokens, 'primary', { borderShade: 'darkest' })
    expect(result.borderColor).toBe(tokens.primary.darkest.toNumber())
  })

  it('omits borderColor when includeBorder is false', () => {
    const result = colorsToTheme(tokens, 'primary', { includeBorder: false })
    expect(result.borderColor).toBeUndefined()
  })

  it('uses DEFAULT backgroundShade explicitly', () => {
    const result = colorsToTheme(tokens, 'primary', { backgroundShade: 'DEFAULT' })
    expect(result.backgroundColor).toBe(tokens.primary.DEFAULT.toNumber())
  })
})

describe('getTextColor', () => {
  it('returns DEFAULT text shade as hex string', () => {
    const tokens = createMockTokens()
    expect(getTextColor(tokens)).toBe('#616161')
  })

  it('returns specified text shade', () => {
    const tokens = createMockTokens()
    expect(getTextColor(tokens, 'darkest')).toBe('#212121')
    expect(getTextColor(tokens, 'lightest')).toBe('#9e9e9e')
  })

  it('applies alpha when provided', () => {
    const tokens = createMockTokens()
    const result = getTextColor(tokens, 'DEFAULT', 0.5)
    expect(result).toBe('rgba(97, 97, 97, 0.5)')
  })

  it('returns hex string when alpha is not provided', () => {
    const tokens = createMockTokens()
    const result = getTextColor(tokens)
    expect(result).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('getBackgroundColor', () => {
  it('returns DEFAULT background shade as number', () => {
    const tokens = createMockTokens()
    expect(getBackgroundColor(tokens)).toBe(0xe0e0e0)
  })

  it('returns specified background shade', () => {
    const tokens = createMockTokens()
    expect(getBackgroundColor(tokens, 'lightest')).toBe(0xffffff)
    expect(getBackgroundColor(tokens, 'darkest')).toBe(0x9e9e9e)
  })
})

describe('getSurfaceColor', () => {
  it('returns DEFAULT surface shade as number', () => {
    const tokens = createMockTokens()
    expect(getSurfaceColor(tokens)).toBe(0xeeeeee)
  })

  it('returns specified surface shade', () => {
    const tokens = createMockTokens()
    expect(getSurfaceColor(tokens, 'lightest')).toBe(0xffffff)
    expect(getSurfaceColor(tokens, 'darkest')).toBe(0xbdbdbd)
  })
})

describe('getBorderColor', () => {
  it('returns DEFAULT border shade as number', () => {
    const tokens = createMockTokens()
    expect(getBorderColor(tokens)).toBe(0x9e9e9e)
  })

  it('returns specified border shade', () => {
    const tokens = createMockTokens()
    expect(getBorderColor(tokens, 'lightest')).toBe(0xe0e0e0)
    expect(getBorderColor(tokens, 'darkest')).toBe(0x424242)
  })
})
