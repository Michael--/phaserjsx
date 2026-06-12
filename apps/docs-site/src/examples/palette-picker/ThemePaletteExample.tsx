/**
 * PalettePicker theme palette example
 */
/** @jsxImportSource @number10/phaserjsx */
import { PalettePicker, Text, numberToHex, useState, View } from '@number10/phaserjsx'

const themeColors = [
  { value: 0x2563eb, label: 'Primary' },
  { value: 0x7c3aed, label: 'Accent' },
  { value: 0x16a34a, label: 'Success' },
  { value: 0xf59e0b, label: 'Warning' },
  { value: 0xdc2626, label: 'Danger' },
  { value: 0x64748b, label: 'Neutral', disabled: true },
]

export function ThemePalettePickerExample() {
  const [color, setColor] = useState(themeColors[1].value)

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <PalettePicker
        colors={themeColors}
        value={color}
        onChange={setColor}
        columns={3}
        swatchSize={34}
        showHex
        labels={{ title: 'Theme colors' }}
        theme={{
          PalettePicker: {
            backgroundColor: 0x111827,
            backgroundAlpha: 0.92,
            borderColor: 0x374151,
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            itemWidth: 72,
            swatchGap: 12,
            rowGap: 12,
            titleStyle: { color: '#ffffff', fontSize: '14px', fontStyle: 'bold' },
            hexStyle: { color: '#cbd5e1', fontSize: '11px' },
          },
        }}
      />

      <Text
        text={`Theme token: ${numberToHex(color).toUpperCase()}`}
        style={{ color: '#9fb3c8' }}
      />
    </View>
  )
}
