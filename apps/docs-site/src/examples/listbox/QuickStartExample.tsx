/** @jsxImportSource @number10/phaserjsx */
import type { ListBoxItem } from '@number10/phaserjsx'
import { ListBox, Text, View, useState } from '@number10/phaserjsx'

const items: ListBoxItem[] = [
  { value: 'player', label: 'Player Settings' },
  { value: 'graphics', label: 'Graphics' },
  { value: 'audio', label: 'Audio' },
  { value: 'controls', label: 'Controls' },
  { value: 'network', label: 'Network', disabled: true },
  { value: 'language', label: 'Language' },
]

export function QuickStartListBoxExample() {
  const [selected, setSelected] = useState<string>('graphics')

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <ListBox
        items={items}
        value={selected}
        onChange={setSelected}
        maxVisibleItems={4}
        width={260}
      />
      <Text text={`Selected: ${items.find((i) => i.value === selected)?.label ?? selected}`} />
    </View>
  )
}
