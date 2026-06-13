/** @jsxImportSource @number10/phaserjsx */
import type { WheelPickerItem } from '@number10/phaserjsx'
import { Text, View, WheelPicker, useState } from '@number10/phaserjsx'

const items: WheelPickerItem[] = [
  { value: 'iron', label: 'Iron Sword' },
  { value: 'silver', label: 'Silver Blade' },
  { value: 'gold', label: 'Golden Axe' },
  { value: 'diamond', label: 'Diamond Spear' },
  { value: 'dragon', label: 'Dragon Fang' },
  { value: 'phantom', label: 'Phantom Edge' },
  { value: 'void', label: 'Void Reaper' },
]

export function ThreeItemWheelPickerExample() {
  const [selected, setSelected] = useState('gold')

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <WheelPicker
        items={items}
        value={selected}
        onChange={setSelected}
        visibleItems={3}
        width={240}
      />
      <Text text={`Weapon: ${items.find((i) => i.value === selected)?.label ?? selected}`} />
    </View>
  )
}
