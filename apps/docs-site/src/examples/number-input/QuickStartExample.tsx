/**
 * NumberInput Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { NumberInput, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartNumberInputExample() {
  const [lives, setLives] = useState(3)

  return (
    <View width="fill" height="fill" justifyContent="center" alignItems="center" gap={16}>
      <NumberInput label="Lives" value={lives} min={0} max={9} onChange={setLives} />
      <Text text={`Current lives: ${lives}`} style={{ color: '#d7e3f4', fontSize: '14px' }} />
    </View>
  )
}
