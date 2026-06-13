/** @jsxImportSource @number10/phaserjsx */
import type { ListBoxItem } from '@number10/phaserjsx'
import { ListBox, Text, View, useState } from '@number10/phaserjsx'

const items: ListBoxItem[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
]

export function NoHoverListBoxExample() {
  const [selected, setSelected] = useState<string>('normal')

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <ListBox
        items={items}
        value={selected}
        onChange={setSelected}
        maxVisibleItems={4}
        width={200}
        hoverable={false}
      />
      <Text text={`Difficulty: ${items.find((i) => i.value === selected)?.label ?? selected}`} />
    </View>
  )
}
