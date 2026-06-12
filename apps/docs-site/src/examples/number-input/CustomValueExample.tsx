/**
 * NumberInput custom value renderer example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NumberInput, Text, useState, View } from '@number10/phaserjsx'

export function CustomValueNumberInputExample() {
  const [energy, setEnergy] = useState(60)

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <NumberInput
        label="Energy"
        value={energy}
        min={0}
        max={100}
        step={10}
        valueWidth={150}
        onChange={setEnergy}
        renderValue={({ value, valueWidth }) => {
          const fillWidth = Math.max(0, Math.round((value / 100) * (valueWidth - 16)))
          const fillColor = value > 70 ? 0x22c55e : value > 30 ? 0xf59e0b : 0xef4444

          return (
            <View direction="column" gap={3} alignItems="center">
              <Text text={`${value}%`} style={{ color: '#ffffff', fontSize: '12px' }} />
              <View width={valueWidth - 16} height={5} backgroundColor={0x1f2937} cornerRadius={3}>
                <View width={fillWidth} height={5} backgroundColor={fillColor} cornerRadius={3} />
              </View>
            </View>
          )
        }}
        theme={{
          NumberInput: {
            valueBackgroundColor: 0x111827,
            valueBorderColor: 0x374151,
            buttonPlacement: 'right',
          },
        }}
      />

      <Text
        text="renderValue keeps the numeric state while replacing the display."
        style={{ color: '#9fb3c8' }}
      />
    </View>
  )
}
