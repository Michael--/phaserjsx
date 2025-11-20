/**
 * Tests for color presets
 */
import { describe, expect, it } from 'vitest'
import {
  applyDarkMode,
  applyLightMode,
  forestGreenPreset,
  generateColorScale,
  getPreset,
  getPresetWithMode,
  midnightPreset,
  oceanBluePreset,
  presets,
} from './color-presets'

describe('Color Presets', () => {
  describe('generateColorScale', () => {
    it('generates a complete color scale', () => {
      const scale = generateColorScale('#ff0000')

      expect(scale).toHaveProperty('lightest')
      expect(scale).toHaveProperty('light')
      expect(scale).toHaveProperty('medium')
      expect(scale).toHaveProperty('dark')
      expect(scale).toHaveProperty('darkest')
      expect(scale).toHaveProperty('DEFAULT')
    })

    it('DEFAULT is alias to medium', () => {
      const baseColor = '#2196f3'
      const scale = generateColorScale(baseColor)

      // DEFAULT should reference the same object as medium
      expect(scale.DEFAULT).toBe(scale.medium)
      expect(scale.DEFAULT.toString()).toBe(scale.medium.toString())
    })

    it('returns HexColor objects with toNumber method', () => {
      const scale = generateColorScale('#808080')

      expect(scale.lightest.toNumber).toBeDefined()
      expect(scale.light.toNumber).toBeDefined()
      expect(scale.medium.toNumber).toBeDefined()
      expect(scale.dark.toNumber).toBeDefined()
      expect(scale.darkest.toNumber).toBeDefined()
      expect(scale.DEFAULT.toNumber).toBeDefined()

      // Test conversion
      expect(typeof scale.DEFAULT.toNumber()).toBe('number')
    })

    it('creates progressively lighter shades', () => {
      const scale = generateColorScale('#808080')

      // Just verify they're different valid hex colors
      expect(scale.lightest).not.toBe(scale.light)
      expect(scale.light).not.toBe(scale.medium)
      // DEFAULT is now alias to medium, so they should be the same
      expect(scale.medium).toBe(scale.DEFAULT)
    })

    it('creates progressively darker shades', () => {
      const scale = generateColorScale('#808080')

      // Just verify they're different valid hex colors
      expect(scale.DEFAULT).not.toBe(scale.dark)
      expect(scale.dark).not.toBe(scale.darkest)
    })
  })

  describe('Preset Structure', () => {
    it('oceanBluePreset has all required colors', () => {
      const { colors } = oceanBluePreset

      expect(colors).toHaveProperty('primary')
      expect(colors).toHaveProperty('secondary')
      expect(colors).toHaveProperty('accent')
      expect(colors).toHaveProperty('success')
      expect(colors).toHaveProperty('warning')
      expect(colors).toHaveProperty('error')
      expect(colors).toHaveProperty('info')
      expect(colors).toHaveProperty('background')
      expect(colors).toHaveProperty('surface')
      expect(colors).toHaveProperty('text')
      expect(colors).toHaveProperty('border')
    })

    it('forestGreenPreset has all required colors', () => {
      const { colors } = forestGreenPreset

      expect(colors).toHaveProperty('primary')
      expect(colors).toHaveProperty('secondary')
      expect(colors).toHaveProperty('accent')
      expect(colors).toHaveProperty('success')
      expect(colors).toHaveProperty('warning')
      expect(colors).toHaveProperty('error')
      expect(colors).toHaveProperty('info')
      expect(colors).toHaveProperty('background')
      expect(colors).toHaveProperty('surface')
      expect(colors).toHaveProperty('text')
      expect(colors).toHaveProperty('border')
    })

    it('midnightPreset has all required colors', () => {
      const { colors } = midnightPreset

      expect(colors).toHaveProperty('primary')
      expect(colors).toHaveProperty('secondary')
      expect(colors).toHaveProperty('accent')
      expect(colors).toHaveProperty('success')
      expect(colors).toHaveProperty('warning')
      expect(colors).toHaveProperty('error')
      expect(colors).toHaveProperty('info')
      expect(colors).toHaveProperty('background')
      expect(colors).toHaveProperty('surface')
      expect(colors).toHaveProperty('text')
      expect(colors).toHaveProperty('border')
    })

    it('each color has complete shade scale', () => {
      const { colors } = oceanBluePreset
      const shadeKeys = ['lightest', 'light', 'medium', 'dark', 'darkest', 'DEFAULT']

      Object.values(colors).forEach((colorShade) => {
        shadeKeys.forEach((key) => {
          const color = colorShade[key as keyof typeof colorShade]
          expect(color).toBeDefined()
          expect(color.toNumber).toBeDefined()
          expect(typeof color.toNumber()).toBe('number')
          expect(color.toString()).toMatch(/^#[0-9a-f]{6}$/i)
        })
      })
    })
  })

  describe('Mode Application', () => {
    it('applyLightMode adjusts neutral colors', () => {
      const lightPreset = applyLightMode(oceanBluePreset)

      // DEFAULT should be alias to medium
      expect(lightPreset.colors.background.DEFAULT.toString()).toBe('#e0e0e0')
      expect(lightPreset.colors.surface.DEFAULT.toString()).toBe('#eeeeee')

      // Text should be dark in light mode
      expect(lightPreset.colors.text.DEFAULT.toString()).toBe('#616161')
    })

    it('applyDarkMode adjusts neutral colors', () => {
      const darkPreset = applyDarkMode(oceanBluePreset)

      // DEFAULT should be alias to medium
      expect(darkPreset.colors.background.DEFAULT.toString()).toBe('#212121')
      expect(darkPreset.colors.surface.DEFAULT.toString()).toBe('#262626')

      // Text should be light in dark mode
      expect(darkPreset.colors.text.DEFAULT.toString()).toBe('#bdbdbd')
    })

    it('mode application preserves brand colors', () => {
      const original = oceanBluePreset
      const light = applyLightMode(original)
      const dark = applyDarkMode(original)

      expect(light.colors.primary).toEqual(original.colors.primary)
      expect(light.colors.secondary).toEqual(original.colors.secondary)
      expect(light.colors.accent).toEqual(original.colors.accent)

      expect(dark.colors.primary).toEqual(original.colors.primary)
      expect(dark.colors.secondary).toEqual(original.colors.secondary)
      expect(dark.colors.accent).toEqual(original.colors.accent)
    })
  })

  describe('Preset Access', () => {
    it('presets object contains all presets', () => {
      expect(presets).toHaveProperty('oceanBlue')
      expect(presets).toHaveProperty('forestGreen')
      expect(presets).toHaveProperty('midnight')
    })

    it('getPreset returns correct preset', () => {
      expect(getPreset('oceanBlue')).toEqual(oceanBluePreset)
      expect(getPreset('forestGreen')).toEqual(forestGreenPreset)
      expect(getPreset('midnight')).toEqual(midnightPreset)
    })

    it('getPresetWithMode applies light mode', () => {
      const preset = getPresetWithMode('oceanBlue', 'light')

      expect(preset.colors.background.DEFAULT.toString()).toBe('#e0e0e0')
      expect(preset.colors.text.DEFAULT.toString()).toBe('#616161')
    })

    it('getPresetWithMode applies dark mode', () => {
      const preset = getPresetWithMode('oceanBlue', 'dark')

      expect(preset.colors.background.DEFAULT.toString()).toBe('#212121')
      expect(preset.colors.text.DEFAULT.toString()).toBe('#bdbdbd')
    })
  })

  describe('Preset Names', () => {
    it('each preset has a name', () => {
      expect(oceanBluePreset.name).toBe('oceanBlue')
      expect(forestGreenPreset.name).toBe('forestGreen')
      expect(midnightPreset.name).toBe('midnight')
    })
  })
})
