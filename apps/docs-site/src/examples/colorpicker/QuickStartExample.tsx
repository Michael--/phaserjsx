/**
 * ColorPicker Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { ColorPicker, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartColorPickerExample() {
  const [color, setColor] = useState(0x2f80ed)

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <ColorPicker value={color} onChange={setColor} />
      <Text
        text={`Selected color: #${color.toString(16).padStart(6, '0').toUpperCase()}`}
        style={{ color: '#d7e3f4', fontSize: '14px' }}
      />
    </View>
  )
}
