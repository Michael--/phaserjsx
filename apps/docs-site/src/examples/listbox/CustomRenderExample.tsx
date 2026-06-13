/** @jsxImportSource @number10/phaserjsx */
import type { ListBoxItem } from '@number10/phaserjsx'
import { ListBox, Text, View, useState } from '@number10/phaserjsx'

const items: ListBoxItem[] = [
  { value: 'sword', label: 'Iron Sword' },
  { value: 'shield', label: 'Oak Shield' },
  { value: 'potion', label: 'Health Potion' },
  { value: 'scroll', label: 'Fire Scroll', disabled: true },
  { value: 'ring', label: 'Gold Ring' },
]

export function CustomRenderListBoxExample() {
  const [selected, setSelected] = useState<string>('sword')

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <ListBox
        items={items}
        value={selected}
        onChange={setSelected}
        maxVisibleItems={4}
        width={280}
        renderItem={({ item, selected, disabled }) => (
          <View direction="row" alignItems="center" gap={10}>
            <Text text={selected ? '●' : '○'} />
            <Text text={item.label ?? item.value} />
            {disabled ? <Text text=" (locked)" /> : null}
          </View>
        )}
      />
      <Text text={`Equipped: ${items.find((i) => i.value === selected)?.label ?? selected}`} />
    </View>
  )
}
