/**
 * PalettePicker Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { PalettePicker, Text, numberToHex, useState, View } from '@number10/phaserjsx'

const quickStartColors = [0x2563eb, 0x16a34a, 0xf59e0b, 0xdc2626, 0x7c3aed, 0x0891b2]

export function QuickStartPalettePickerExample() {
  const [color, setColor] = useState(quickStartColors[0])

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <PalettePicker colors={quickStartColors} value={color} onChange={setColor} />

      <View direction="row" gap={10} alignItems="center">
        <View width={28} height={28} backgroundColor={color} cornerRadius={5} />
        <Text text={`Selected: ${numberToHex(color).toUpperCase()}`} style={{ color: '#9fb3c8' }} />
      </View>
    </View>
  )
}
