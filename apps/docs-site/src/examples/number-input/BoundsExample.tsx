/**
 * NumberInput bounds and step example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NumberInput, Text, useState, View } from '@number10/phaserjsx'

export function BoundsNumberInputExample() {
  const [volume, setVolume] = useState(50)
  const [speed, setSpeed] = useState(1)

  return (
    <View
      width="fill"
      height="fill"
      justifyContent="center"
      alignItems="center"
      direction="column"
      gap={20}
    >
      <View direction="column" gap={8} alignItems="center">
        <NumberInput
          label="Volume"
          value={volume}
          min={0}
          max={100}
          step={5}
          onChange={setVolume}
          formatValue={(value) => `${value}%`}
        />
        <Text text="Step 5, clamped between 0 and 100" style={{ color: '#9fb3c8' }} />
      </View>

      <View direction="column" gap={8} alignItems="center">
        <NumberInput
          label="Speed"
          value={speed}
          min={0.25}
          max={2}
          step={0.25}
          precision={2}
          onChange={setSpeed}
          formatValue={(value) => `${value.toFixed(2)}x`}
        />
        <Text text="Decimal steps keep precision stable" style={{ color: '#9fb3c8' }} />
      </View>
    </View>
  )
}
