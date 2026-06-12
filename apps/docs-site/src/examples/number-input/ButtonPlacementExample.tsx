/**
 * NumberInput button placement example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NumberInput, Text, useState, View } from '@number10/phaserjsx'

export function ButtonPlacementNumberInputExample() {
  const [split, setSplit] = useState(3)
  const [left, setLeft] = useState(10)
  const [right, setRight] = useState(24)

  return (
    <View
      width="fill"
      height="fill"
      justifyContent="center"
      alignItems="center"
      direction="column"
      gap={18}
    >
      <NumberInput
        label="Split"
        value={split}
        min={0}
        max={9}
        onChange={setSplit}
        buttonPlacement="split"
      />

      <NumberInput
        label="Left stack"
        value={left}
        min={0}
        max={20}
        onChange={setLeft}
        buttonPlacement="left"
        buttonDirection="column"
        labels={{ decrement: '<', increment: '>' }}
      />

      <NumberInput
        label="Right controls"
        value={right}
        min={16}
        max={32}
        onChange={setRight}
        buttonPlacement="right"
        repeatOnHold
        decrementContent={<Text text="-" style={{ color: '#888800', fontSize: '18px' }} />}
        incrementContent={<Text text="+" style={{ color: '#888800', fontSize: '18px' }} />}
      />

      <Text text="Hold a button to repeat changes." style={{ color: '#9fb3c8' }} />
    </View>
  )
}
