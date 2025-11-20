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
      const scale = generateColorScale(0xff0000)

      expect(scale).toHaveProperty('lightest')
      expect(scale).toHaveProperty('light')
      expect(scale).toHaveProperty('medium')
      expect(scale).toHaveProperty('dark')
      expect(scale).toHaveProperty('darkest')
      expect(scale).toHaveProperty('DEFAULT')
    })

    it('uses base color as DEFAULT', () => {
      const baseColor = 0x2196f3
      const scale = generateColorScale(baseColor)

      expect(scale.DEFAULT).toBe(baseColor)
    })

    it('creates progressively lighter shades', () => {
      const scale = generateColorScale(0x808080)

      expect(scale.lightest).toBeGreaterThan(scale.light)
      expect(scale.light).toBeGreaterThan(scale.medium)
      expect(scale.medium).toBeGreaterThan(scale.DEFAULT)
    })

    it('creates progressively darker shades', () => {
      const scale = generateColorScale(0x808080)

      expect(scale.DEFAULT).toBeGreaterThan(scale.dark)
      expect(scale.dark).toBeGreaterThan(scale.darkest)
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
          expect(typeof colorShade[key as keyof typeof colorShade]).toBe('number')
        })
      })
    })
  })

  describe('Mode Application', () => {
    it('applyLightMode adjusts neutral colors', () => {
      const lightPreset = applyLightMode(oceanBluePreset)

      // Light backgrounds should be bright
      expect(lightPreset.colors.background.DEFAULT).toBeGreaterThan(0xf00000)
      expect(lightPreset.colors.surface.DEFAULT).toBe(0xffffff)

      // Text should be dark in light mode
      expect(lightPreset.colors.text.DEFAULT).toBeLessThan(0x500000)
    })

    it('applyDarkMode adjusts neutral colors', () => {
      const darkPreset = applyDarkMode(oceanBluePreset)

      // Dark backgrounds should be dark
      expect(darkPreset.colors.background.DEFAULT).toBeLessThan(0x200000)
      expect(darkPreset.colors.surface.DEFAULT).toBeLessThan(0x300000)

      // Text should be light in dark mode
      expect(darkPreset.colors.text.DEFAULT).toBe(0xffffff)
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

      expect(preset.colors.background.DEFAULT).toBeGreaterThan(0xf00000)
      expect(preset.colors.text.DEFAULT).toBeLessThan(0x500000)
    })

    it('getPresetWithMode applies dark mode', () => {
      const preset = getPresetWithMode('oceanBlue', 'dark')

      expect(preset.colors.background.DEFAULT).toBeLessThan(0x200000)
      expect(preset.colors.text.DEFAULT).toBe(0xffffff)
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
