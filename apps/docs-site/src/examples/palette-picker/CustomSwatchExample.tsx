/**
 * PalettePicker custom swatch and empty-state example
 */
/** @jsxImportSource @number10/phaserjsx */
import { PalettePicker, Text, useState, View } from '@number10/phaserjsx'

const namedColors = [
  { value: 0x0ea5e9, label: 'Sky' },
  { value: 0x22c55e, label: 'Leaf' },
  { value: 0xf97316, label: 'Heat' },
  { value: 0xec4899, label: 'Pop' },
]

export function CustomSwatchPalettePickerExample() {
  const [color, setColor] = useState(namedColors[0].value)

  return (
    <View
      width="fill"
      height="fill"
      direction="row"
      justifyContent="center"
      alignItems="center"
      gap={26}
    >
      <PalettePicker
        colors={namedColors}
        value={color}
        onChange={setColor}
        columns={2}
        labels={{ title: 'Named' }}
        renderSwatch={({ option, color: swatchColor, selected, size, selectedBorderColor }) => (
          <View
            width={size + 8}
            height={size + 8}
            backgroundColor={swatchColor}
            borderColor={selected ? selectedBorderColor : 0x334155}
            borderWidth={selected ? 3 : 1}
            cornerRadius={8}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              text={(option.label ?? option.hex).slice(0, 1)}
              style={{ color: '#ffffff', fontSize: '14px', fontStyle: 'bold' }}
            />
          </View>
        )}
      />

      <PalettePicker colors={[]} labels={{ title: 'Recent', empty: 'No recent colors' }} />
    </View>
  )
}
