/**
 * ColorPicker localized labels and theme example
 */
/** @jsxImportSource @number10/phaserjsx */
import { ColorPicker, Text, useState, View } from '@number10/phaserjsx'

export function LocalizedColorPickerExample() {
  const [color, setColor] = useState(0x7c4dff)

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <ColorPicker
        value={color}
        onChange={setColor}
        labels={{
          title: 'Farbe',
          tone: 'Ton',
          vivid: 'Kraeftig',
          muted: 'Gedimmt',
          hue: 'Farbton',
          saturation: 'Saettigung',
          lightness: 'Helligkeit',
          formatRgb: (rgb: { r: number; g: number; b: number }) =>
            `RGB ${rgb.r} / ${rgb.g} / ${rgb.b}`,
        }}
        theme={{
          ColorPicker: {
            backgroundColor: 0x20242d,
            borderColor: 0x52606d,
            controlBackgroundColor: 0x2f3744,
            trackLength: 250,
            previewSize: 104,
            titleStyle: { color: '#ffffff', fontSize: '15px', fontStyle: 'bold' },
            labelStyle: { color: '#cbd5e1', fontSize: '12px' },
            valueStyle: { color: '#ffffff', fontSize: '12px' },
          },
        }}
      />
      <Text text="Labels and theme can be supplied by the app." style={{ color: '#cbd5e1' }} />
    </View>
  )
}
