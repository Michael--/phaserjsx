/**
 * NumberInput formatter, labels, and theme example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NumberInput, Text, useState, View } from '@number10/phaserjsx'

export function ThemingNumberInputExample() {
  const [temperature, setTemperature] = useState(21)

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <NumberInput
        label="Temperatur"
        labelPosition="top"
        value={temperature}
        min={16}
        max={28}
        step={0.5}
        precision={1}
        onChange={setTemperature}
        labels={{ decrement: '-', increment: '+', value: 'Wert' }}
        formatValue={(value) => `${value.toFixed(1)} C`}
        theme={{
          NumberInput: {
            gap: 8,
            valueWidth: 96,
            controlHeight: 38,
            buttonControlSize: 38,
            valueBackgroundColor: 0x101826,
            valueBackgroundAlpha: 1,
            valueBorderColor: 0x64748b,
            valueStyle: { color: '#ffffff', fontSize: '16px', fontStyle: 'bold' },
            labelStyle: { color: '#cbd5e1', fontSize: '13px' },
            Button: {
              backgroundColor: 0x334155,
              borderColor: 0x64748b,
              textStyle: { color: '#ffffff', fontSize: '16px', fontStyle: 'bold' },
            },
          },
        }}
      />
      <Text
        text="Labels, formatters, and theme values are app-owned."
        style={{ color: '#cbd5e1' }}
      />
    </View>
  )
}
