/**
 * Dropdown Quick Start Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Dropdown, Text, useState, View, type DropdownOption } from '@phaserjsx/ui'

const fruits: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'orange', label: 'Orange' },
]

export function QuickStartDropdownExample() {
  const [selected, setSelected] = useState<string>('')

  return (
    <View width={'fill'} height={'fill'} gap={16} direction="stack" borderColor={0xff0000}>
      <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" padding={16}>
        <Text text="Select Fruit" style={{ color: '#ffffff', fontSize: '16px' }} />
        <Text
          text={`Selected: ${fruits.find((f) => f.value === selected)?.label || 'None'}`}
          style={{ color: '#aaaaaa', fontSize: '14px' }}
        />
      </View>

      <View width={'fill'} alignItems="center" padding={16}>
        <Dropdown
          stackLayout={true}
          options={fruits}
          value={selected}
          onChange={(value) => setSelected(value as string)}
          placeholder="Choose a fruit..."
          width={250}
          maxHeight={200}
        />
        <Text
          text="Note: Dropdown uses a stack layout to overlay the menu above other content."
          style={{ color: '#95a5a6', fontSize: '11px' }}
        />
      </View>
    </View>
  )
}
