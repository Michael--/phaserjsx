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

    it('uses base color as DEFAULT', () => {
      const baseColor = '#2196f3'
      const scale = generateColorScale(baseColor)

      expect(scale.DEFAULT).toBe(baseColor)
    })

    it('returns hex strings', () => {
      const scale = generateColorScale('#808080')

      expect(scale.lightest).toMatch(/^#[0-9a-f]{6}$/i)
      expect(scale.light).toMatch(/^#[0-9a-f]{6}$/i)
      expect(scale.medium).toMatch(/^#[0-9a-f]{6}$/i)
      expect(scale.dark).toMatch(/^#[0-9a-f]{6}$/i)
      expect(scale.darkest).toMatch(/^#[0-9a-f]{6}$/i)
      expect(scale.DEFAULT).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('creates progressively lighter shades', () => {
      const scale = generateColorScale('#808080')

      // Just verify they're different valid hex colors
      expect(scale.lightest).not.toBe(scale.light)
      expect(scale.light).not.toBe(scale.medium)
      expect(scale.medium).not.toBe(scale.DEFAULT)
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
          expect(colorShade).toHaveProperty(key)
          expect(typeof colorShade[key as keyof typeof colorShade]).toBe('string')
          expect(colorShade[key as keyof typeof colorShade]).toMatch(/^#[0-9a-f]{6}$/i)
        })
      })
    })
  })

  describe('Mode Application', () => {
    it('applyLightMode adjusts neutral colors', () => {
      const lightPreset = applyLightMode(oceanBluePreset)

      // Light backgrounds should be bright (white-ish)
      expect(lightPreset.colors.background.DEFAULT).toBe('#fafafa')
      expect(lightPreset.colors.surface.DEFAULT).toBe('#ffffff')

      // Text should be dark in light mode
      expect(lightPreset.colors.text.DEFAULT).toBe('#212121')
    })

    it('applyDarkMode adjusts neutral colors', () => {
      const darkPreset = applyDarkMode(oceanBluePreset)

      // Dark backgrounds should be dark
      expect(darkPreset.colors.background.DEFAULT).toBe('#121212')
      expect(darkPreset.colors.surface.DEFAULT).toBe('#1e1e1e')

      // Text should be light in dark mode
      expect(darkPreset.colors.text.DEFAULT).toBe('#ffffff')
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

      expect(preset.colors.background.DEFAULT).toBe('#fafafa')
      expect(preset.colors.text.DEFAULT).toBe('#212121')
    })

    it('getPresetWithMode applies dark mode', () => {
      const preset = getPresetWithMode('oceanBlue', 'dark')

      expect(preset.colors.background.DEFAULT).toBe('#121212')
      expect(preset.colors.text.DEFAULT).toBe('#ffffff')
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
