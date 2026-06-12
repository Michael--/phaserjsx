import { describe, expect, it } from 'vitest'
import {
  chunkPalettePickerColors,
  getPalettePickerContrastColor,
  normalizePalettePickerColor,
  normalizePalettePickerColors,
  resolvePalettePickerValue,
  type PalettePickerColor,
} from './PalettePicker'
import { getContrastRatio } from '../../colors'

const colors: PalettePickerColor[] = [
  0xff0000,
  { value: 0x00ff00, label: 'Green' },
  { value: 0x0000ff, label: 'Blue', disabled: true },
]

describe('PalettePicker utilities', () => {
  it('normalizes number and object colors', () => {
    expect(normalizePalettePickerColor(0x1ff00aa)).toEqual({
      value: 0xff00aa,
      hex: '#FF00AA',
    })
    expect(normalizePalettePickerColor({ value: 0x00ff00, label: 'Green' })).toEqual({
      value: 0x00ff00,
      label: 'Green',
      hex: '#00FF00',
    })
  })

  it('resolves controlled, default, and fallback values', () => {
    const normalized = normalizePalettePickerColors(colors)

    expect(resolvePalettePickerValue(normalized, 0x00ff00)).toBe(0x00ff00)
    expect(resolvePalettePickerValue(normalized, 0xffffff)).toBeUndefined()
    expect(resolvePalettePickerValue(normalized, undefined, 0x0000ff)).toBe(0x0000ff)
    expect(resolvePalettePickerValue(normalized)).toBe(0xff0000)
    expect(resolvePalettePickerValue([])).toBeUndefined()
  })

  it('chunks colors by column count', () => {
    expect(chunkPalettePickerColors([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunkPalettePickerColors([1, 2, 3], 0)).toEqual([[1], [2], [3]])
  })

  it('returns a contrast color suitable for a swatch mark', () => {
    const contrast = getPalettePickerContrastColor(0xffffff, 0xffffff)

    expect(getContrastRatio(contrast, 0xffffff)).toBeGreaterThanOrEqual(4.5)
  })
})
