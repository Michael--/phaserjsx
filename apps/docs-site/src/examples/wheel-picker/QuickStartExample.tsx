/** @jsxImportSource @number10/phaserjsx */
import type { WheelPickerItem } from '@number10/phaserjsx'
import { Text, View, WheelPicker, useState } from '@number10/phaserjsx'

const items: WheelPickerItem[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
  { value: 'nightmare', label: 'Nightmare' },
]

export function QuickStartWheelPickerExample() {
  const [selected, setSelected] = useState('normal')

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <WheelPicker
        items={items}
        value={selected}
        onChange={setSelected}
        visibleItems={5}
        width={200}
      />
      <Text text={`Difficulty: ${selected}`} />
    </View>
  )
}
