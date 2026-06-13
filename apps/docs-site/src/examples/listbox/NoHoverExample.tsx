/** @jsxImportSource @number10/phaserjsx */
import type { ListBoxItem } from '@number10/phaserjsx'
import { ListBox, Text, View, useState } from '@number10/phaserjsx'

const items: ListBoxItem[] = [
  { value: 'story', label: 'Story' },
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
  { value: 'nightmare', label: 'Nightmare' },
  { value: 'custom', label: 'Custom' },
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
        scrollViewProps={{ sliderSize: 'tiny' }}
      />
      <Text text={`Difficulty: ${items.find((i) => i.value === selected)?.label ?? selected}`} />
    </View>
  )
}
