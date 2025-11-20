/**
 * Tests for color utility functions
 */
import { describe, expect, it } from 'vitest'
import {
  alpha,
  darken,
  ensureContrast,
  getContrastRatio,
  hexToNumber,
  lighten,
  numberToHex,
  numberToRgb,
  rgbToNumber,
} from './color-utils'

describe('Color Conversion', () => {
  describe('hexToNumber', () => {
    it('converts hex string with hash to number', () => {
      expect(hexToNumber('#ffffff')).toBe(0xffffff)
      expect(hexToNumber('#ff0000')).toBe(0xff0000)
      expect(hexToNumber('#00ff00')).toBe(0x00ff00)
      expect(hexToNumber('#0000ff')).toBe(0x0000ff)
    })

    it('converts hex string without hash to number', () => {
      expect(hexToNumber('ffffff')).toBe(0xffffff)
      expect(hexToNumber('ff0000')).toBe(0xff0000)
      expect(hexToNumber('000000')).toBe(0x000000)
    })

    it('handles lowercase hex', () => {
      expect(hexToNumber('#abcdef')).toBe(0xabcdef)
      expect(hexToNumber('abcdef')).toBe(0xabcdef)
    })
  })

  describe('numberToHex', () => {
    it('converts number to hex string with hash', () => {
      expect(numberToHex(0xffffff)).toBe('#ffffff')
      expect(numberToHex(0xff0000)).toBe('#ff0000')
      expect(numberToHex(0x00ff00)).toBe('#00ff00')
      expect(numberToHex(0x0000ff)).toBe('#0000ff')
    })

    it('converts number to hex string without hash', () => {
      expect(numberToHex(0xffffff, false)).toBe('ffffff')
      expect(numberToHex(0xff0000, false)).toBe('ff0000')
      expect(numberToHex(0x000000, false)).toBe('000000')
    })

    it('pads short hex values', () => {
      expect(numberToHex(0x000001)).toBe('#000001')
      expect(numberToHex(0x000100)).toBe('#000100')
      expect(numberToHex(0x010000)).toBe('#010000')
    })
  })

  describe('rgbToNumber', () => {
    it('converts RGB to number', () => {
      expect(rgbToNumber(255, 255, 255)).toBe(0xffffff)
      expect(rgbToNumber(255, 0, 0)).toBe(0xff0000)
      expect(rgbToNumber(0, 255, 0)).toBe(0x00ff00)
      expect(rgbToNumber(0, 0, 255)).toBe(0x0000ff)
      expect(rgbToNumber(0, 0, 0)).toBe(0x000000)
    })

    it('handles mid-range values', () => {
      expect(rgbToNumber(128, 128, 128)).toBe(0x808080)
      expect(rgbToNumber(64, 128, 192)).toBe(0x4080c0)
    })
  })

  describe('numberToRgb', () => {
    it('converts number to RGB', () => {
      expect(numberToRgb(0xffffff)).toEqual({ r: 255, g: 255, b: 255 })
      expect(numberToRgb(0xff0000)).toEqual({ r: 255, g: 0, b: 0 })
      expect(numberToRgb(0x00ff00)).toEqual({ r: 0, g: 255, b: 0 })
      expect(numberToRgb(0x0000ff)).toEqual({ r: 0, g: 0, b: 255 })
      expect(numberToRgb(0x000000)).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('handles mid-range values', () => {
      expect(numberToRgb(0x808080)).toEqual({ r: 128, g: 128, b: 128 })
      expect(numberToRgb(0x4080c0)).toEqual({ r: 64, g: 128, b: 192 })
    })
  })
})

describe('Color Manipulation', () => {
  describe('lighten', () => {
    it('lightens a color', () => {
      const red = 0xff0000
      const lightRed = lighten(red, 0.5)
      const rgb = numberToRgb(lightRed)

      expect(rgb.r).toBeGreaterThan(255 * 0.5)
      expect(rgb.g).toBeGreaterThan(0)
      expect(rgb.b).toBeGreaterThan(0)
    })

    it('returns white at maximum lightening', () => {
      expect(lighten(0x000000, 1.0)).toBe(0xffffff)
      expect(lighten(0xff0000, 1.0)).toBe(0xffffff)
    })

    it('returns original color at zero lightening', () => {
      expect(lighten(0xff0000, 0)).toBe(0xff0000)
      expect(lighten(0x00ff00, 0)).toBe(0x00ff00)
    })

    it('clamps amount to valid range', () => {
      expect(lighten(0x000000, 1.5)).toBe(0xffffff)
      expect(lighten(0xff0000, -0.5)).toBe(0xff0000)
    })
  })

  describe('darken', () => {
    it('darkens a color', () => {
      const red = 0xff0000
      const darkRed = darken(red, 0.5)
      const rgb = numberToRgb(darkRed)

      expect(rgb.r).toBeLessThan(255)
      expect(rgb.g).toBe(0)
      expect(rgb.b).toBe(0)
    })

    it('returns black at maximum darkening', () => {
      expect(darken(0xffffff, 1.0)).toBe(0x000000)
      expect(darken(0xff0000, 1.0)).toBe(0x000000)
    })

    it('returns original color at zero darkening', () => {
      expect(darken(0xff0000, 0)).toBe(0xff0000)
      expect(darken(0x00ff00, 0)).toBe(0x00ff00)
    })

    it('clamps amount to valid range', () => {
      expect(darken(0xffffff, 1.5)).toBe(0x000000)
      expect(darken(0xff0000, -0.5)).toBe(0xff0000)
    })
  })

  describe('alpha', () => {
    it('converts color to rgba string', () => {
      expect(alpha(0xff0000, 1.0)).toBe('rgba(255, 0, 0, 1)')
      expect(alpha(0x00ff00, 0.5)).toBe('rgba(0, 255, 0, 0.5)')
      expect(alpha(0x0000ff, 0.0)).toBe('rgba(0, 0, 255, 0)')
    })

    it('defaults to full opacity', () => {
      expect(alpha(0xffffff)).toBe('rgba(255, 255, 255, 1)')
      expect(alpha(0x000000)).toBe('rgba(0, 0, 0, 1)')
    })

    it('clamps alpha to valid range', () => {
      expect(alpha(0xff0000, 1.5)).toBe('rgba(255, 0, 0, 1)')
      expect(alpha(0xff0000, -0.5)).toBe('rgba(255, 0, 0, 0)')
    })
  })
})

describe('Contrast Utilities', () => {
  describe('getContrastRatio', () => {
    it('returns maximum contrast for black on white', () => {
      const ratio = getContrastRatio(0x000000, 0xffffff)
      expect(ratio).toBe(21)
    })

    it('returns maximum contrast for white on black', () => {
      const ratio = getContrastRatio(0xffffff, 0x000000)
      expect(ratio).toBe(21)
    })

    it('returns minimum contrast for same colors', () => {
      expect(getContrastRatio(0xffffff, 0xffffff)).toBe(1)
      expect(getContrastRatio(0x000000, 0x000000)).toBe(1)
      expect(getContrastRatio(0xff0000, 0xff0000)).toBe(1)
    })

    it('calculates reasonable contrast for mid-range colors', () => {
      const ratio = getContrastRatio(0x808080, 0xffffff)
      expect(ratio).toBeGreaterThan(1)
      expect(ratio).toBeLessThan(21)
    })
  })

  describe('ensureContrast', () => {
    it('returns original color if contrast is sufficient', () => {
      const fg = 0x000000
      const bg = 0xffffff
      expect(ensureContrast(fg, bg, 4.5)).toBe(fg)
    })

    it('adjusts color to meet minimum contrast', () => {
      const fg = 0x888888 // gray
      const bg = 0xffffff // white
      const adjusted = ensureContrast(fg, bg, 4.5)

      expect(adjusted).not.toBe(fg)
      expect(getContrastRatio(adjusted, bg)).toBeGreaterThanOrEqual(4.5)
    })

    it('lightens on dark backgrounds', () => {
      const fg = 0x333333 // dark gray
      const bg = 0x000000 // black
      const adjusted = ensureContrast(fg, bg, 4.5)

      const fgRgb = numberToRgb(fg)
      const adjRgb = numberToRgb(adjusted)

      expect(adjRgb.r).toBeGreaterThanOrEqual(fgRgb.r)
      expect(adjRgb.g).toBeGreaterThanOrEqual(fgRgb.g)
      expect(adjRgb.b).toBeGreaterThanOrEqual(fgRgb.b)
    })

    it('darkens on light backgrounds', () => {
      const fg = 0xcccccc // light gray
      const bg = 0xffffff // white
      const adjusted = ensureContrast(fg, bg, 4.5)

      const fgRgb = numberToRgb(fg)
      const adjRgb = numberToRgb(adjusted)

      expect(adjRgb.r).toBeLessThanOrEqual(fgRgb.r)
      expect(adjRgb.g).toBeLessThanOrEqual(fgRgb.g)
      expect(adjRgb.b).toBeLessThanOrEqual(fgRgb.b)
    })

    it('uses default WCAG AA ratio', () => {
      const fg = 0x888888
      const bg = 0xffffff
      const adjusted = ensureContrast(fg, bg)

      expect(getContrastRatio(adjusted, bg)).toBeGreaterThanOrEqual(4.5)
    })
  })
})
